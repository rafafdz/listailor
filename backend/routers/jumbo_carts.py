from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from aiocache import Cache
from cart.jumbo_api import perform_login, get_shopping_lists, create_shopping_list, edit_shoppint_list

cache = Cache(Cache.MEMORY)

BASE_LIST_NAME = 'listAIlor'

router = APIRouter(prefix="/jumbo_carts", tags=["jumbo_cart"])

class Credentials(BaseModel):
    username: str
    password: str

@router.post("/verify_credentials")
async def verify_credentials(credentials: Credentials):
    response = perform_login(credentials.username, credentials.password)
    auth_status = response.get('/authStatus')

    cache_key = f'login.{credentials.username}'
    await cache.set(cache_key, response, ttl=60*60*24)
    
    if auth_status == 'Success':
        return {"message": "Login successful", "token": response.get('token')}
    elif auth_status == 'WrongCredentials':
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


class ShoppingListEdit(BaseModel):
    username: str
    password: str
    products: dict

@router.post("/shopping_list")
async def edit_shopping_list(shopping_list_edit: ShoppingListEdit):
    cache_key = f'login.{shopping_list_edit.username}' 
    cached_response = await cache.get(cache_key)

    if not cached_response:
        res = perform_login(shopping_list_edit.username, shopping_list_edit.password)
        if res['authStatus'] != 'Success':
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
        await cache.set(cache_key, res, ttl=60*60*24)
        
    login_response = await cache.get(cache_key)
    token = login_response.get('token')
    
    shopping_lists = get_shopping_lists(token)
    listailor = next((item for item in shopping_lists if item['name'] == BASE_LIST_NAME), None)

    if not listailor:
        create_response = create_shopping_list(token, BASE_LIST_NAME)
        listailor_id = create_response.get('id')
    else:
        listailor_id = listailor['id']

    edit_response = edit_shoppint_list(token, listailor_id, shopping_list_edit.products)
    
    return { 'message': 'shopping list updated', 'shopping_list_id': listailor_id,
             'response': edit_response }
