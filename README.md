### **Typescript Node.js Rest API Using Express With MongoDB**

The project was developed for football tournament case. To develop it, there are some prerequisites.

    * node version : v14.17.0
    * yarn version : 1.22.5
    * docker version : 20.10.2
    * docker-compose version : 1.27.4

To initialize project

    * cd <workspace>
    * mkdir <project_name> && cd <project_name>
    * npm init

To install typescript and express dependencies

    * yarn add express
    * yarn add -D typescript @types/express
    
To create typescript config file

    * npx tsc --init
    
To install eslint dependencies formatting code and initialize it (create .eslintrc.json in root directory)

    * yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
    
To fix automatically code format after saving, create .vscode/settings.json

To restart application automatically after changes, install nodemon dependency and create nodemon.dev.json

    * yarn add -D nodemon

To define environment variables, create .env under root directory.

You can see **mongodb schemas of colletions and models** corresponding to these schemas under db directory. Details can be found in https://mongoosejs.com/docs/guide.html.

Custom exceptions and responses are under **exception and response directory.**

**Winston logger** defines log format under **logger directory** according to environment variable named as **NODE_ENV**.

Coming requests go step by step as you can see below.

    1. If request needs to validate token, you must firstly define handleToken function as middleware for this request in controller layer.
    2. If request needs pagination, you must firstly define handlePagination function as middleware for this request in controller layer.
    3. If body, params or query of request validation are required, Joi validation is used in controller layer before sending request to service layer.
    4. Service layer is responsbile for business processes. If any db operation like inserting, updating or getting is required, service layer communicates with repository layer that is responsible for db operations.
    5. If any exception exists in any layer, exception handler middlewares play a role to throw custom meaningful exception.
    6. Custom response as dto is served when everythins is ok.

If you meet prerequisites above, you can run and test all rest apis on **postman** by only running one command.

    docker-compose up -d

You can reach **postman collection** from this url https://documenter.getpostman.com/view/16080504/UVC9hR4A. Collection explanations will mention about how to use it.

    




    

