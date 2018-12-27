# Data Migration

This is the third assignment from EDX course on NodeJs. The goal is to migrate data from 2 different sources and insert into Mongo db parallely.

The source files are present in the data directory.

The command to run the migrator is
```
node index.js
node index.js <limit>
```
Here the limit is used to define the number of records to be processed at a time. If limit is not provided, the default value 100 is used.
