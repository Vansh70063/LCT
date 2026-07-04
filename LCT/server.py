
Action: file_editor create /app/backend/server.py --file-text "from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import List, Annotated, Any, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix=\"/api\")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- MongoDB Adherence ---
def validate_object_id(v: Any) -> str:
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, str) and ObjectId.is_valid(v):
        return v
    raise ValueError(\"Invalid ObjectId\")

PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]

class BaseDocument(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra=\"ignore\"
    )
    
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias=\"_id\")
    
    def to_mongo(self) -> dict:
        exclude_fields = {\"id\"}
        data = self.model_dump(by_alias=True, exclude=exclude_fields)
        data[\"_id\"] = ObjectId(self.id)
        return data

    @classmethod
    def from_mongo(cls, data: dict):
        if not data:
            return None
        if \"_id\" in data:
            data[\"_id\"] = str(data[\"_id\"])
        return cls(**data)

# --- Models ---
class User(BaseDocument):
    email: str
    password_hash: str
    name: str
    role: str = \"client\"  # \"client\" or \"admin\"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: datetime

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class ServicePrice(BaseDocument):
    key: str
    name: str
    category: str  # \"digital\", \"design\", \"business\", \"student\"
    price: float
    price_unit: str = \"flat rate\"
    description: str = \"\"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServicePriceUpdate(BaseModel):
    price: float
    price_unit: str
    description: str

class ServiceRequest(BaseDocument):
    client_id: str
    client_name: str
    client_email: str
    service_key: str
    service_name: str
    category: str
    description: str
    deadline: str
    price_at_request: float
    status: str = \"Pending\"  # \"Pending\", \"Approved\", \"In Progress\", \"Completed\", \"Cancelled\"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ServiceRequestCreate(BaseModel):
    service_key: str
    description: str
    deadline: str

class ServiceRequestStatusUpdate(BaseModel):
    status: str

class AISuggestRequest(BaseModel):
    service_name: str
    prompt_hint: str

# Legacy StatusCheck Models to preserve backward compatibility
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra=\"ignore\")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# --- Authentication Helpers ---
JWT_ALGORITHM = \"HS256\"

def get_jwt_secret() -> str:
    return os.environ.get(\"JWT_SECRET\", \"lct-secret-key-12345-very-secure-modern-startup\")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(\"utf-8\"), salt)
    return hashed.decode(\"utf-8\")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode(\"utf-8\"), hashed_password.encode(\"utf-8\"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        \"sub\": user_id,
        \"email\": email,
        \"exp\": datetime.now(timezone.utc) + timedelta(minutes=60),  # Extended for smoother dev testing
        \"type\": \"access\"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        \"sub\": user_id,
        \"exp\": datetime.now(timezone.utc) + timedelta(days=7),
        \"type\": \"refresh\"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> User:
    token = request.cookies.get(\"access_token\")
    if not token:
        auth_header = request.headers.get(\"Authorization\", \"\")
        if auth_header.startswith(\"Bearer \"):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get(\"type\") != \"access\":
            raise HTTPException(status_code=401, detail=\"Invalid token type\")
        
        user_doc = await db.users.find_one({\"_id\": ObjectId(payload[\"sub\"])})
        if not user_doc:
            raise HTTPException(status_code=401, detail=\"User not found\")
        
        return User.from_mongo(user_doc)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail=\"Token expired\")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail=\"Invalid token\")

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != \"admin\":
        raise HTTPException(status_code=403, detail=\"Admin privileges required\")
    return current_user


# --- Brute Force Protection Helpers ---
async def check_lockout(email: str, ip: str) -> bool:
    identifier = f\"{ip}:{email.lower().strip()}\"
    attempt = await db.login_attempts.find_one({\"identifier\": identifier})
    if attempt and attempt.get(\"failed_count\", 0) >= 5:
        last_failed = attempt.get(\"last_failed\")
        if last_failed:
            if isinstance(last_failed, str):
                last_failed = datetime.fromisoformat(last_failed)
            if datetime.now(timezone.utc) - last_failed < timedelta(minutes=15):
                return True
    return False

async def record_failed_attempt(email: str, ip: str):
    identifier = f\"{ip}:{email.lower().strip()}\"
    await db.login_attempts.update_one(
        {\"identifier\": identifier},
        {
            \"$inc\": {\"failed_count\": 1},
            \"$set\": {\"last_failed\": datetime.now(timezone.utc)}
        },
        upsert=True
    )

async def clear_failed_attempts(email: str, ip: str):
    identifier = f\"{ip}:{email.lower().strip()}\"
    await db.login_attempts.delete_one({\"identifier\": identifier})


# --- Legacy Routes (Preserved) ---
@api_router.get(\"/\")
async def root():
    return {\"message\": \"Hello World\"}

@api_router.post(\"/status\", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get(\"/status\", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {\"_id\": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# --- AUTHENTICATION ROUTES ---
@api_router.post(\"/auth/register\")
async def register(input: UserRegister, response: Response):
    email = input.email.lower().strip()
    existing = await db.users.find_one({\"email\": email})
    if existing:
        raise HTTPException(status_code=400, detail=\"Email is already registered\")
    
    hashed = hash_password(input.password)
    new_user = User(
        email=email,
        password_hash=hashed,
        name=input.name,
        role=\"client\"
    )
    
    user_data = new_user.to_mongo()
    await db.users.insert_one(user_data)
    
    access_token = create_access_token(new_user.id, email)
    refresh_token = create_refresh_token(new_user.id)
    
    response.set_cookie(key=\"access_token\", value=access_token, httponly=True, secure=False, samesite=\"lax\", max_age=3600, path=\"/\")
    response.set_cookie(key=\"refresh_token\", value=refresh_token, httponly=True, secure=False, samesite=\"lax\", max_age=604800, path=\"/\")
    
    return {
        \"id\": new_user.id,
        \"email\": email,
        \"name\": input.name,
        \"role\": \"client\",
        \"token\": access_token
    }

@api_router.post(\"/auth/login\")
async def login(input: UserLogin, request: Request, response: Response):
    email = input.email.lower().strip()
    ip = request.client.host if request.client else \"unknown\"
    
    if await check_lockout(email, ip):
        raise HTTPException(status_code=429, detail=\"Too many failed attempts. Locked out for 15 minutes.\")
        
    user_doc = await db.users.find_one({\"email\": email})
    if not user_doc or not verify_password(input.password, user_doc[\"password_hash\"]):
        await record_failed_attempt(email, ip)
        raise HTTPException(status_code=401, detail=\"Invalid email or password\")
        
    await clear_failed_attempts(email, ip)
    user = User.from_mongo(user_doc)
    
    access_token = create_access_token(user.id, email)
    refresh_token = create_refresh_token(user.id)
    
    response.set_cookie(key=\"access_token\", value=access_token, httponly=True, secure=False, samesite=\"lax\", max_age=3600, path=\"/\")
    response.set_cookie(key=\"refresh_token\", value=refresh_token, httponly=True, secure=False, samesite=\"lax\", max_age=604800, path=\"/\")
    
    return {
        \"id\": user.id,
        \"email\": user.email,
        \"name\": user.name,
        \"role\": user.role,
        \"token\": access_token
    }

@api_router.get(\"/auth/me\", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        created_at=current_user.created_at
    )

@api_router.post(\"/auth/logout\")
async def logout(response: Response, current_user: User = Depends(get_current_user)):
    response.delete_cookie(key=\"access_token\", path=\"/\")
    response.delete_cookie(key=\"refresh_token\", path=\"/\")
    return {\"message\": \"Logged out successfully\"}


# --- SERVICE PRICES ROUTES ---
@api_router.get(\"/prices\", response_model=List[ServicePrice])
async def get_prices():
    prices_docs = await db.services_prices.find().to_list(100)
    return [ServicePrice.from_mongo(doc) for doc in prices_docs]

@api_router.put(\"/prices/{key}\", response_model=ServicePrice)
async def update_price(key: str, input: ServicePriceUpdate, current_admin: User = Depends(get_current_admin)):
    existing = await db.services_prices.find_one({\"key\": key})
    if not existing:
        raise HTTPException(status_code=404, detail=\"Service key not found\")
        
    await db.services_prices.update_one(
        {\"key\": key},
        {
            \"$set\": {
                \"price\": input.price,
                \"price_unit\": input.price_unit,
                \"description\": input.description,
                \"updated_at\": datetime.now(timezone.utc)
            }
        }
    )
    
    updated_doc = await db.services_prices.find_one({\"key\": key})
    return ServicePrice.from_mongo(updated_doc)


# --- SERVICE REQUESTS ROUTES ---
@api_router.post(\"/requests\", response_model=ServiceRequest)
async def create_request(input: ServiceRequestCreate, current_user: User = Depends(get_current_user)):
    service_price_doc = await db.services_prices.find_one({\"key\": input.service_key})
    if not service_price_doc:
        raise HTTPException(status_code=404, detail=\"Selected service is invalid\")
    
    service_price = ServicePrice.from_mongo(service_price_doc)
    
    new_request = ServiceRequest(
        client_id=current_user.id,
        client_name=current_user.name,
        client_email=current_user.email,
        service_key=input.service_key,
        service_name=service_price.name,
        category=service_price.category,
        description=input.description,
        deadline=input.deadline,
        price_at_request=service_price.price
    )
    
    await db.requests.insert_one(new_request.to_mongo())
    return new_request

@api_router.get(\"/requests\", response_model=List[ServiceRequest])
async def get_requests(current_user: User = Depends(get_current_user)):
    if current_user.role == \"admin\":
        requests_docs = await db.requests.find().sort(\"created_at\", -1).to_list(1000)
    else:
        requests_docs = await db.requests.find({\"client_id\": current_user.id}).sort(\"created_at\", -1).to_list(1000)
    return [ServiceRequest.from_mongo(doc) for doc in requests_docs]

@api_router.patch(\"/requests/{request_id}/status\", response_model=ServiceRequest)
async def update_request_status(request_id: str, input: ServiceRequestStatusUpdate, current_admin: User = Depends(get_current_admin)):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail=\"Invalid request ID format\")
        
    existing = await db.requests.find_one({\"_id\": ObjectId(request_id)})
    if not existing:
        raise HTTPException(status_code=404, detail=\"Request not found\")
        
    await db.requests.update_one(
        {\"_id\": ObjectId(request_id)},
        {\"$set\": {\"status\": input.status}}
    )
    
    updated_doc = await db.requests.find_one({\"_id\": ObjectId(request_id)})
    return ServiceRequest.from_mongo(updated_doc)

@api_router.delete(\"/requests/{request_id}\")
async def delete_request(request_id: str, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail=\"Invalid request ID format\")
        
    existing = await db.requests.find_one({\"_id\": ObjectId(request_id)})
    if not existing:
        raise HTTPException(status_code=404, detail=\"Request not found\")
    
    req = ServiceRequest.from_mongo(existing)
    
    # Clients can only delete their own PENDING requests; admin can delete any.
    if current_user.role != \"admin\" and req.client_id != current_user.id:
        raise HTTPException(status_code=403, detail=\"Not authorized to delete this request\")
    if current_user.role != \"admin\" and req.status != \"Pending\":
        raise HTTPException(status_code=400, detail=\"Can only cancel requests that are still Pending\")
        
    await db.requests.delete_one({\"_id\": ObjectId(request_id)})
    return {\"message\": \"Request cancelled successfully\"}


# --- AI SUGGESTION ROUTE (Emergent LLM Integration) ---
@api_router.post(\"/ai/suggest\")
async def ai_suggest(input: AISuggestRequest, current_user: User = Depends(get_current_user)):
    api_key = os.environ.get(\"EMERGENT_LLM_KEY\", \"\")
    if not api_key:
        # Fallback in case key is missing (for local test robustness)
        return {
            \"suggestion\": f\"[MOCKED LLM RESPONSE] Draft requirements for {input.service_name} based on concept '{input.prompt_hint}':\n\"
                          f\"1. Goal: Build a high-quality product matching the client brief.\n\"
                          f\"2. Core features:\n\"
                          f\"   - Fully functional frontend layout.\n\"
                          f\"   - Modern UI design conforming to specifications.\n\"
                          f\"   - Responsive dashboard interfaces.\n\"
                          f\"3. Timeline & budget check should be conducted by agency lead.\"
        }
    
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
        
        chat = LlmChat(
            api_key=api_key,
            session_id=str(uuid.uuid4()),
            system_message=(
                \"You are an elite requirements architect at LastChoiceTech services. \"
                \"Your role is to translate a brief, high-level client concept into a crisp, \"
                \"world-class, bulleted product requirements document (PRD) or project outline. \"
                \"Keep it concise, realistic, structured with headings, and directly useful \"
                \"for the team to design and build. Do not use generic filler text or emojis. \"
                \"Focus on core pages, features, and target user persona.\"
            )
        ).with_model(\"openai\", \"gpt-5.4\")
        
        user_prompt = (
            f\"Service Category: {input.service_name}\n\"
            f\"Client Concept Brief: {input.prompt_hint}\n\n\"
            f\"Generate structured, professional technical requirement specifications for this project.\"
        )
        
        user_message = UserMessage(text=user_prompt)
        
        # Gather streaming response in memory
        response_text = \"\"
        async for event in chat.stream_message(user_message):
            if isinstance(event, TextDelta):
                response_text += event.content
            elif isinstance(event, StreamDone):
                break
                
        return {\"suggestion\": response_text.strip()}
        
    except Exception as e:
        logger.error(f\"Error calling Emergent LLM integration: {e}\", exc_info=True)
        return {
            \"error\": str(e),
            \"suggestion\": f\"An error occurred generating suggestions: {e}. Please draft your requirements manually.\"
        }


# Include the router in the main app
app.include_router(api_router)

# Set CORS origins dynamically or from env
cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)


# --- Seeding & Indexes Startup ---
INITIAL_SERVICES = [
    {
        \"key\": \"website-development\",
        \"name\": \"Website Development\",
        \"category\": \"digital\",
        \"price\": 24999.0,
        \"price_unit\": \"starting at\",
        \"description\": \"Custom, responsive website built with modern frameworks like React, Tailwind, and FastAPI. Includes animations, SEO setup, and high-performance.\"
    },
    {
        \"key\": \"graphic-editing\",
        \"name\": \"Graphic Editing\",
        \"category\": \"digital\",
        \"price\": 1499.0,
        \"price_unit\": \"per project\",
        \"description\": \"Professional photo retouching, color grading, background removal, and vector asset generation for your marketing channels.\"
    },
    {
        \"key\": \"visiting-card-design\",
        \"name\": \"Visiting Card Design\",
        \"category\": \"digital\",
        \"price\": 999.0,
        \"price_unit\": \"flat rate\",
        \"description\": \"Elegant, double-sided business card designs with source files and print-ready files tailored to your brand identity.\"
    },
    {
        \"key\": \"poster-banner-design\",
        \"name\": \"Poster & Banner Design\",
        \"category\": \"digital\",
        \"price\": 1999.0,
        \"price_unit\": \"per design\",
        \"description\": \"Eye-catching commercial posters, social media banners, roll-up banners, and print advertisements.\"
    },
    {
        \"key\": \"t-shirt-design\",
        \"name\": \"T-shirt Design\",
        \"category\": \"digital\",
        \"price\": 1499.0,
        \"price_unit\": \"per design\",
        \"description\": \"Creative custom graphics, typography, and illustration files optimized for screen printing or print-on-demand.\"
    },
    {
        \"key\": \"interior-room-design\",
        \"name\": \"Interior & Room Designing\",
        \"category\": \"design\",
        \"price\": 14999.0,
        \"price_unit\": \"per room\",
        \"description\": \"3D visualization, spatial planning, furniture selection, and lighting theme consultation for modern residential or office spaces.\"
    },
    {
        \"key\": \"presentation-design\",
        \"name\": \"Presentation Design\",
        \"category\": \"business\",
        \"price\": 3999.0,
        \"price_unit\": \"up to 15 slides\",
        \"description\": \"High-impact PowerPoint or PDF decks for business pitches, investor rounds, or corporate reporting.\"
    },
    {
        \"key\": \"business-branding\",
        \"name\": \"Business Branding\",
        \"category\": \"business\",
        \"price\": 9999.0,
        \"price_unit\": \"package\",
        \"description\": \"Complete corporate identity package including logo design, color palette, brand guidelines book, and letterheads.\"
    },
    {
        \"key\": \"notes-making\",
        \"name\": \"Notes Making\",
        \"category\": \"student\",
        \"price\": 999.0,
        \"price_unit\": \"per subject\",
        \"description\": \"Comprehensive, clean, and structured digital summaries of academic lectures, textbooks, or specific course syllabi.\"
    },
    {
        \"key\": \"assignment-making\",
        \"name\": \"Assignment Making\",
        \"category\": \"student\",
        \"price\": 1499.0,
        \"price_unit\": \"per assignment\",
        \"description\": \"Premium academic research assistance, structured documentation, reference compiling, and formatting guidelines support.\"
    },
    {
        \"key\": \"competitive-exam-tests\",
        \"name\": \"Competitive Exam Tests\",
        \"category\": \"student\",
        \"price\": 1999.0,
        \"price_unit\": \"test series\",
        \"description\": \"Customized mock test preparation, subject-wise quizzes, and standard answers key for academic and entrance exams.\"
    },
    {
        \"key\": \"presentation-making\",
        \"name\": \"Presentation Making (PPT)\",
        \"category\": \"student\",
        \"price\": 1199.0,
        \"price_unit\": \"up to 10 slides\",
        \"description\": \"Visually appealing and highly coherent academic presentation slides tailored to school or university project guidelines.\"
    }
]

@app.on_event(\"startup\")
async def startup_db_client():
    # Setup Indexes
    await db.users.create_index(\"email\", unique=True)
    await db.services_prices.create_index(\"key\", unique=True)
    await db.login_attempts.create_index(\"identifier\")
    
    # Seeding Prices
    prices_count = await db.services_prices.count_documents({})
    if prices_count == 0:
        for s in INITIAL_SERVICES:
            price_doc = ServicePrice(**s)
            await db.services_prices.insert_one(price_doc.to_mongo())
        logger.info(\"Successfully seeded service prices!\")
        
    # Seeding Admin User
    admin_email = os.environ.get(\"ADMIN_EMAIL\", \"admin@lastchoicetech.com\").lower().strip()
    admin_password = os.environ.get(\"ADMIN_PASSWORD\", \"admin_password_123\")
    existing_admin = await db.users.find_one({\"email\": admin_email})
    if not existing_admin:
        hashed = hash_password(admin_password)
        admin_user = User(
            email=admin_email,
            password_hash=hashed,
            name=\"LCT Admin\",
            role=\"admin\"
        )
        await db.users.insert_one(admin_user.to_mongo())
        logger.info(f\"Seeded admin user: {admin_email}\")
    else:
        # Update password if .env changed
        if not verify_password(admin_password, existing_admin[\"password_hash\"]):
            await db.users.update_one(
                {\"email\": admin_email},
                {\"$set\": {\"password_hash\": hash_password(admin_password)}}
            )
            logger.info(\"Updated admin user password based on updated .env configuration.\")

@app.on_event(\"shutdown\")
async def shutdown_db_client():
    client.close()
"
