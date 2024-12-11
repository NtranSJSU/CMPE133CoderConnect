# CoderConnect


# CoderConnect

## Prerequisites

Make sure you have the following installed on your machine:
- [MySQL](https://www.mysql.com/)
- [Python](https://www.python.org/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

Make sure MySQL password is set to `root`.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/NtranSJSU/CMPE133CoderConnect.git
    cd CMPE133CoderConnect
    ```

2. **Set up the frontend:**

    ```bash
    cd frontend
    yarn install
    ```

3. **Set up the backend:**

    ```bash
    cd ../backend
    pip install -r requirements.txt
    yarn install
    ```

4. **Run MySQL setup script:**

    ```bash
    python setup_mysql.py
    ```

5. **Run environment setup script:**

    ```bash
    python setup_env.py
    ```

## Starting MySQL

Run Command Prompt as admin and start MySQL:

```bash
net start MySQL80
```

## Application Setup
```
cd frontend
yarn install

cd .. 
cd backend 
pip install -r requirements.txt
yarn install
```

## Starting mySQL
```
run Command Prompt as admin
net start MySQL80
```

## how to run
```
cd frontend 
yarn dev

cd .. 
cd backend
python app.py
```

## Installing Dummy Data
```
//make sure you are in backend folder
cd backend
python insert_dummy_data.py
```

