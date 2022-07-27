# Description

# Contents

0. [Installation](#Installation)
1. [Goods](#Goods)
2. [User](#User)
3. [ADMIN-role endpoint](#ADMIN-role-endpoint)
4. [Order](#Order)
5. [Manager](#Manager)

# Installation

```bash
npm i
```

## Start

```
npm run dev
```

[:arrow_up:Contents](#Contents)

# Goods

## https://api.snaptrap.online/api/goods/

**GET**

_return a list of all products_

**POST**

_example_

![Alt-текст](https://i.ibb.co/r48nC1c/image.png "example")

---

## https://api.snaptrap.online/api/goods/{id}

**GET**

_return one product with {id}_

**DELETE**

_Delete product with {id}_

_return 'Deleted successfully' or 'Wrong id'_

[:arrow_up:Contents](#Contents)

# User

## https://api.snaptrap.online/api/user/registration

**POST**

_example_

![Alt-текст](https://i.ibb.co/M9hvyJg/1.png "example")

_return token_

---

## https://api.snaptrap.online/api/user/login

**POST**

_example_

```

{
"telephone_number": "test_user_1",
"password": "password"
}

```

_return_

```
{
    "token": "eyJh...",
    "userTgID": "317..."
}
```

---

## https://api.snaptrap.online/api/user/all

**GET**

_return_

```
[
    {
        "id": 1,
        "telephone_number": "375445...",
        "password": "$2b$05$F...",
        "telegram_user_id": "3171...",
        "verification": false,
        "file_name": "f7984e25....jpg",
        "role": "ADMIN",
        "createdAt": "2021-11-10T19:18:54.460Z",
        "updatedAt": "2021-11-10T19:18:54.460Z"
    },
    ...
]
```

---

## https://api.snaptrap.online/api/user/{id}

**GET**

_return one user with {id}_

```
    {
        "id": 1,
        "telephone_number": "375445...",
        "password": "$2b$05$F...",
        "telegram_user_id": "3171...",
        "verification": false,
        "file_name": "f7984e25....jpg",
        "role": "ADMIN",
        "createdAt": "2021-11-10T19:18:54.460Z",
        "updatedAt": "2021-11-10T19:18:54.460Z"
    }
```

**DELETE**

_Delete product with {id}_

_return 'Deleted successfully' or 'Wrong id'_

---

## https://api.snaptrap.online/api/user/auth

**GET**

```

header { Authorization: Bearer {token}}

```

_return new token_

---

## https://api.snaptrap.online/api/user/:id/verificate

**POST**

verified User

---

## https://api.snaptrap.online/api/user/cheak_login

**POST**

```
{"telephone_number": "test_user_1"}
```

return

```
{ status: 200, message: "Empty" }
```

or

```
{ status: 404, message: "User already exists" }
```

[:arrow_up:Contents](#Contents)

# ADMIN-role endpoint

**Header example**

```

authorization: Bearer {token}

```

![Alt-текст](https://i.ibb.co/nCxzMRF/image.png "example")

[:arrow_up:Contents](#Contents)

# Manager

## https://api.snaptrap.online/api/manager/create

**POST**

_example_

```
{
    "telephone_number":"22222222222222"
}
```

_return_

```
{
    "id": 1,
    "name": "test_1",
    "telegram_user_id": "test_1",
    "order_list": []
}
```

---

## https://api.snaptrap.online/api/manager/all

**GET**

_return array of managers_

```
[
    {
        "id": 1,
        "name": "test_1",
        "telegram_user_id": "test_1",
        "order_list": [],
        "createdAt": "2021-12-07T17:56:12.111Z",
        "updatedAt": "2021-12-07T17:56:12.111Z"
    },
    ...
]
```

## https://api.snaptrap.online/api/manager/{id}

**GET**

_return manager with {id}_

or

```
{
  "status": 404,
  "message": "Manager not found"
}
```

---

## https://api.snaptrap.online/api/manager/delete

**POST**

_Delete manager_

```
{
    "telephone_number":"22222222222222"
}
```

_return_

"Deleted successfully"

or

```
{
    "status": 404,
    "message": "telephone_number"
}
```

---

## https://api.snaptrap.online/api/manager/freemanager

**GET**

_return_

First less busy manager

```
{
    "id": 2,
    "name": "test_2",
    "telegram_user_id": "test_2",
    "order_list": [],
    "order_queue": 3,
    "createdAt": "2021-12-07T19:00:20.433Z",
    "updatedAt": "2021-12-07T19:00:20.433Z"
}
```

or

_"Manager not found"_

[:arrow_up:Contents](#Contents)

# Order

## https://api.snaptrap.online/api/order/create

**POST**

```
{
    "user_ID": "test_user_1",
    "product_list": [
        {
            "product_id": "product_id_1",
            "product_name": "product_1_name",
            "quantity": 50,
            "total_price": 150
        },
        ...
    ],
    "total_price": 450
}
```

_return_

```
{
    "id": 11,
    "add_time": "1639054843292",
    "user_ID": "test_user_1",
    "manager_ID": "4",
    "manager_Telegramm_ID": "manager_telegram_id_4",
    "product_list": [
        {
            "product_id": "product_id_1",
            "product_name": "product_1_name",
            "quantity": 50,
            "total_price": 150
        },
        ...
    ],
    "order_status": false
}
```

or

_"Incorrect user_ID or product_list" || "Managers not found"_

---

## https://api.snaptrap.online/api/order/all

**GET**

_return array of all orders_

```
[
    {
        "product_list": [
            {
                "product_id": "product_id_1",
                "product_name": "product_1_name",
                "quantity": 50,
                "total_price": 150
            },
           ...
        ],
        "id": 2,
        "add_time": "1639054832667",
        "user_ID": "test_user_1",
        "manager_ID": "3",
        "manager_Telegramm_ID": "manager_telegram_id_3",
        "order_status": false,
        "createdAt": "2021-12-09T13:00:32.670Z",
        "updatedAt": "2021-12-09T13:00:32.670Z"
    },
  ...
]
```

or

_"Orders not found"_

---

## https://api.snaptrap.online/api/order/{id}

**GET**

_return order by {id}_

```
{
    "product_list": [
        {
            "product_id": "product_id_1",
            "product_name": "product_1_name",
            "quantity": 50,
            "total_price": 150
        },
        ...
    ],
    "id": 2,
    "add_time": "1639054832667",
    "user_ID": "test_user_1",
    "manager_ID": "3",
    "manager_Telegramm_ID": "manager_telegram_id_3",
    "order_status": false,
    "createdAt": "2021-12-09T13:00:32.670Z",
    "updatedAt": "2021-12-09T13:00:32.670Z"
}
```

or

_"Order not found"_

**DELETE**

_Delete order with {id}_

_return 'Deleted successfully' or 'Wrong id'_

---
