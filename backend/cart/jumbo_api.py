import pdb, requests
API_KEY = 'mVFAlvqMdA4miAu6fLJT'
API_KEY2 = 'Chaq1BgS20u3vm6BwFDx'

def perform_login(username, password):
    url = 'https://sm-web-api.ecomm.cencosud.com/user/api/v1/vtexid/pub/authentication/start'
    headers = {
        'accept': 'application/json, text/plain, */*',
        'apikey': API_KEY,
    }
    response = requests.get(url, headers=headers).json()

    auth_token = response.get('authenticationToken')
    validate_url = 'https://sm-web-api.ecomm.cencosud.com/user/api/v1/vtexid/pub/authentication/classic/validate'
    validate_headers = {
        'accept': 'application/json, text/plain, */*',
        'apikey': API_KEY,
        'content-type': 'application/json',
        'referer': 'https://www.jumbo.cl/',
        'x-consumer': 'jumbo'
    }
    validate_data = {
        'authenticationToken': auth_token,
        'login': username,
        'password': password
    }
    
    # res['authStatus'] == 'Success'
    # res['authStatus'] == 'WrongCredentials' 
    return requests.post(validate_url, headers=validate_headers, json=validate_data).json()

def get_shopping_lists(token):
    url = 'https://sm-web-api.ecomm.cencosud.com/shoppinglist/api/v1/user/shopping-list'
    headers = {
        'accept': 'application/json, text/plain, */*',
        'apikey': API_KEY2,
        'token': token,
        'x-consumer': 'jumbo',
    }
    response = requests.get(url, headers=headers)
    return response.json()

def create_shopping_list(token, name):
    url = 'https://sm-web-api.ecomm.cencosud.com/shoppinglist/api/v1/user/shopping-list'
    headers = {
        'accept': 'application/json, text/plain, */*',
        'apikey': API_KEY2,
        'content-type': 'application/json',
        'token': token,
        'x-consumer': 'jumbo'
    }
    data = {
        'name': name,
        'skus': '{}',
        'type': 'client'
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()
    

def edit_shoppint_list(token, list_id, products): 
    # prducts schema:  { '2123': { 'quantity': 2 }, '294' : { 'quantity': 1 } }
    url = f'https://sm-web-api.ecomm.cencosud.com/shoppinglist/api/v1/user/shopping-list/{list_id}'
    headers = {
        'apikey': API_KEY2,
        'content-type': 'application/json',
        'token': token,
        'x-consumer': 'jumbo'
    }
    data = {
        'name': 'listailor',
        'skus': products,
        'type': 'client'
    }
    response = requests.put(url, headers=headers, json=data)
    return response.json()

if __name__ == '__main__':
    res = perform_login('titap77905@inpsur.com', '@rbolitO12')
    token = res.get('token')
    shop = get_shopping_lists(token)
    test_list = next((item for item in shop if item['name'] == 'test'), None)
    test_list_id = test_list['id']
    res = edit_shoppint_list(token, test_list_id, { '81001': { 'quantity': 9 } })
    pdb.set_trace()