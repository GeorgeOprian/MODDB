-- DIN PROVINCIE IN BUCURESTI:

CREATE PUBLIC DATABASE LINK BD_BUCURESTI
  CONNECT TO MODBD_BUCURESTI
  IDENTIFIED BY parolamodbd
USING '(DESCRIPTION=
            (ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))
            (CONNECT_DATA=(SERVICE_NAME=modbd1))
        )';
        
        
select * from agent_imobiliar_bucuresti@bd_bucuresti;

-- DIN NATIONAL IN PROVINCIE 
CREATE PUBLIC DATABASE LINK BD_PROVINCIE
  CONNECT TO MODBD_PROVINCIE
  IDENTIFIED BY parolamodbd
USING '(DESCRIPTION=
            (ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))
            (CONNECT_DATA=(SERVICE_NAME=modbd2))
        )';
        
select * from agent_imobiliar_provincie@bd_provincie;


DROP PUBLIC DATABASE LINK BD_NATIONAL