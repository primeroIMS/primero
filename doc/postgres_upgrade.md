<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

Upgrading a Major PostgreSQL Version
===========

PostgreSQL data directories cannot be reused between major version upgrades. A data directory generated for PostgreSQL 10.x will not work with Postgres 11.x. When running Primero PostgreSQL with Docker, the data needs to be exported and reloaded, and the backing volume needs to be recreated.

In the instructions below, the **Primero Server** refers to the machine that runs a Dockerized Primero and the **Ansible Server** refers to the machine that is used to provision it with Ansible.

1. Create a back up of the database volume. This will not be used for the migration, but can be used to roll back the upgrade if something goes wrong. Look at the [Docker documentation](https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes) for more information about backing up and restoring volumes. On the **Primero Server**:

        $ mkdir postgres_backup && chmod 777 postgres_backup
        $ docker run --rm --volumes-from primero_postgres_1 -v $(pwd)/postgres_backup:/backup busybox tar czvf /backup/primero-postgres-volume-backup.tar.gz /var/lib/postgresql/data
        $ chmod 700 postgres_backup

2. Shut down all application containers. On the **Primero Server**:

        $ docker stop primero_application_1 primero_worker_1

3. Create the migration data dump. On the **Primero Server**:

        $ mkdir migration_data
        $ docker exec -t primero_postgres_1 pg_dumpall -c -U primero > migration_data/primero_migration_data.sql

4. Delete the PostgreSQL data volume. On the **Primero Server**:

        $ docker container stop primero_postgres_1
        $ docker container rm primero_postgres_1
        $ docker volume rm primero_database


5. Deploy Primero v2.5+ with the new database version using Ansible. The inventory file will need to specify the major PostgreSQL version in the variable `primero_postgres_version`. This will deploy the new PostgreSQL image and recreate the data volume. On the **Ansible Server**:

        $ cd </path/to/primero>/ansible
        $ ./bin/activate
        $ ansible-playbook application-primero.yml --tags start -l <primero-instance> -i </path/to/inventory.yml>

6. Restore the migration dump file to the new database. On the **Primero Server**:

        $ docker cp $(pwd)/migration_data/primero_migration_data.sql primero_postgres_1:/
        $ docker exec -t primero_postgres_1 psql -f /primero_migration_data.sql -U primero

7. **(Necessary if upgrading from PostgreSQL 10.)** If the password encryption strategy is changing (MD5 to SCRAM), the `primero` role password will need to be reset. On the **Primero Server:**

        $ docker exec -t primero_postgres_1 bash -c 'echo "ALTER ROLE primero PASSWORD '"'"'${POSTGRES_PASSWORD}'"'"';" | psql -U primero'

8. Restart again, from the ***Ansible Server:**

        $ ansible-playbook application-primero.yml --tags start -l <primero-instance> -i </path/to/inventory.yml>


9. After verifying that the upgrade was successful, remember to delete both `backup/primero-postgres-volume-backup.tar.gz` and `primero_migration_data.sql`.
