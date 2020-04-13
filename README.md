# Auth service

For start server exec `npm run docker:run`

If you will use this application, please set star
or create fork this repository
___

### Requirements
* ### Models
    * User
        - name
        - email
        - password
        - approved
        - info: jsonb
        - serverId
        - type: [basic]
    
    * Session
        - userId
        -  ip
        -  token (jwt)
        -  expiredIn
        -  expiredFlag
    
    * Server
        - name
        - slug
        - url

* ### Endpoints
    * User
      - create (return all data about user)
      - update ~(return all data about user)
      - delete
    * Auth
      - login (return all data about user)
      - logout
      - checkToken (return all data about user)

### Additional
Redis session
When create session in psql, create data in redis, also redis should have expired hook. When will trigger this hook, need update data in psql in session table { expired Flag: true }

After logout set expiredFlag in pasq to TRUE, and remove key in Redis db

Roles should realize on customer server side
