# Authentication Project
Hey, this is my authentication project.
If you got time or are bored, you can pentest it or review my code

# Bugs / Anything else
If you found a bug or got anything else, open an issue. Thanks!

## Preview Site
Check out the preview here: 
The default 3 credentials ive put in are:
+ example1@gmail.com
+ example2@gmail.com
+ example3@gmail.com

Again, I'm sorry for taking up your time!

# ENV file
Your env file should contain the following fields:
NEXT_PUBLIC_URL - Your server's URL
APP_SECRET - A randomly generated string, used for salting the user tokens.
DB_USER - Database user
DB_PASS - Database password
DB_NAME - Database name
DB_HOST - Database host
DB_PORT - Database port (Default 5432)

## Why an app secret?
I used an app_secret in the project, so in case of the database getting compromised, they could not generate user sessions using purely the data on the database. This secret will be rotated.