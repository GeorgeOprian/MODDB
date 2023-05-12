-- view pe judet
create or replace view oltp_judet
as
select * from modbd_provincie.judet_provincie@bd_provincie
union all
select * from modbd_bucuresti.judet_bucuresti;

-- view pe localitate
create or replace view oltp_localitate
as
select * from modbd_provincie.localitate_provincie@bd_provincie
union all
select * from modbd_bucuresti.localitate_bucuresti;

-- view pe chirias
create or replace view oltp_chirias
as
select * from modbd_bucuresti.chirias;

-- view pe adrese
create or replace view oltp_adresa
as
select * from modbd_provincie.adresa_provincie@bd_provincie
union all
select * from modbd_bucuresti.adresa_bucuresti;

-- view pe apartament
create or replace view oltp_apartament
as
select * from modbd_provincie.apartament_provincie@bd_provincie
union all
select * from modbd_bucuresti.apartament_bucuresti;

-- view pe AGENT_IMOBILIAR
create or replace view oltp_AGENT_IMOBILIAR
as 
select ag_prov.id_agent, ag_prov.nume, ag_prov.prenume, ag_prov.email, ag_prov.telefon, ag_prov.data_angajare, ag_nat_1.salariu, ag_nat_1.comision
from modbd_provincie.AGENT_IMOBILIAR@bd_provincie ag_prov
join agent_imobiliar ag_nat_1 on ag_prov.id_agent = ag_nat_1.id_agent;


-- view pe contract
create or replace view oltp_CONTRACT
as
select * from modbd_provincie.contract_provincie@bd_provincie
union all
select * from modbd_bucuresti.contract_bucuresti;


-- view pe plata chirie
create or replace view oltp_plata_chirie
as
select * from modbd_provincie.plata_chirie_provincie@bd_provincie
union all
select * from modbd_bucuresti.plata_chirie_bucuresti;

-- 

-------
-- la triggeri ca sa fac vad unde trebuie sa fac update trebuie sa pot face diferenta intre id-urile vechi si cele noi
-- ca sa acopar cazul de id-uri vechi verific daca id-ul curent este in range-ul de id-uri vechi sau daca e par sau impar
-------



-- trigger pentru insert, update, delete pe oltp_chirias
CREATE OR REPLACE TRIGGER t_chirias
INSTEAD OF INSERT OR UPDATE OR DELETE ON oltp_chirias
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        BEGIN
            INSERT INTO modbd_bucuresti.chirias VALUES (modbd_bucuresti.BUCURESTI_CHIRIAS_SEQ.NEXTVAL, :NEW.prenume, :NEW.nume, :NEW.telefon, :NEW.email, :NEW.sex, :NEW.data_nastere, :NEW.starea_civila);
        EXCEPTION
            WHEN DUP_VAL_ON_INDEX THEN
                NULL; -- Înregistrarea există deja, nu se face nimic
        END;
    ELSIF UPDATING THEN
        UPDATE modbd_bucuresti.chirias SET prenume = :NEW.prenume, nume = :NEW.nume, telefon = :NEW.telefon, email = :NEW.email, sex = :NEW.sex, data_nastere = :NEW.data_nastere, starea_civila = :NEW.starea_civila 
        WHERE id_chirias = :NEW.id_chirias AND (prenume <> :NEW.prenume OR nume <> :NEW.nume OR telefon <> :NEW.telefon OR email <> :NEW.email OR sex <> :NEW.sex OR data_nastere <> :NEW.data_nastere OR starea_civila <> :NEW.starea_civila ) ;
    ELSIF DELETING THEN
        DELETE FROM modbd_bucuresti.chirias WHERE id_chirias = :OLD.id_chirias;
    END IF;
END;
/

-- trigger pentru adresa
CREATE OR REPLACE TRIGGER t_adresa
INSTEAD OF INSERT OR UPDATE OR DELETE ON oltp_adresa
FOR EACH ROW
DECLARE
    v_in_bucuresti NUMBER := 0;
BEGIN
    
    select count (*) into v_in_bucuresti from modbd_bucuresti.localitate_bucuresti loc
    join modbd_bucuresti.judet_bucuresti jud on loc.id_judet = jud.id_judet
    where id_localitate = :new.id_localitate AND jud.nume = 'Bucuresti';
    
    if v_in_bucuresti = 0 then
        IF INSERTING THEN
            BEGIN
                INSERT INTO adresa_provincie@bd_provincie VALUES (PROVINCIE_ADRESA_SEQ.NEXTVAL@bd_provincie, :NEW.strada, :NEW.numar, :NEW.bloc, :NEW.scara, :NEW.numar_apartament, :NEW.id_localitate);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE adresa_provincie@bd_provincie SET id_adresa = :NEW.id_adresa, strada = :NEW.strada, numar = :NEW.numar, bloc = :NEW.bloc, scara = :NEW.scara, numar_apartament = :NEW.numar_apartament, id_localitate = :NEW.id_localitate 
            WHERE id_adresa = :NEW.id_adresa AND (strada <> :NEW.strada OR numar <> :NEW.numar OR bloc <> :NEW.bloc OR scara <> :NEW.scara OR numar_apartament <> :NEW.numar_apartament OR id_localitate <> :NEW.id_localitate ) ;
        ELSIF DELETING THEN
            DELETE FROM adresa_provincie@bd_provincie WHERE id_adresa = :OLD.id_adresa;
        END IF;
    else
        IF INSERTING THEN
            BEGIN
                INSERT INTO modbd_bucuresti.adresa_bucuresti VALUES (modbd_bucuresti.BUCURESTI_ADRESA_SEQ.NEXTVAL, :NEW.strada, :NEW.numar, :NEW.bloc, :NEW.scara, :NEW.numar_apartament, :NEW.id_localitate);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE modbd_bucuresti.adresa_bucuresti SET id_adresa = :NEW.id_adresa, strada = :NEW.strada, numar = :NEW.numar, bloc = :NEW.bloc, scara = :NEW.scara, numar_apartament = :NEW.numar_apartament, id_localitate = :NEW.id_localitate 
            WHERE id_adresa = :NEW.id_adresa AND (strada <> :NEW.strada OR numar <> :NEW.numar OR bloc <> :NEW.bloc OR scara <> :NEW.scara OR numar_apartament <> :NEW.numar_apartament OR id_localitate <> :NEW.id_localitate ) ;
        ELSIF DELETING THEN
            DELETE FROM modbd_bucuresti.adresa_bucuresti WHERE id_adresa = :OLD.id_adresa;
        END IF;
    end if;
END;
/


--am ramas aici

--trigger aparatamente
CREATE OR REPLACE TRIGGER t_apartament
INSTEAD OF INSERT OR UPDATE OR DELETE ON oltp_apartament
FOR EACH ROW
DECLARE
    v_in_bucuresti NUMBER := 0;
BEGIN

    select count (*) into v_in_bucuresti from modbd_bucuresti.adresa_bucuresti adr
    join modbd_bucuresti.localitate_bucuresti loc on adr.id_localitate = loc.id_localitate
    join modbd_bucuresti.judet_bucuresti jud on loc.id_judet = jud.id_judet
    where adr.id_adresa = :NEW.id_adresa AND jud.nume = 'Bucuresti';
    
    if v_in_bucuresti = 0 then
        IF INSERTING THEN
            BEGIN
                INSERT INTO apartament_provincie@bd_provincie VALUES (PROVINCIE_APARTAMENT_SEQ.NEXTVAL@bd_provincie, :NEW.id_adresa, :NEW.numar_camere, :NEW.etaj, :NEW.suprafata, :NEW.centrala_proprie, :NEW.pret_inchiriere, :NEW.tip_confort);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE apartament_provincie@bd_provincie SET id_adresa = :NEW.id_adresa, numar_camere = :NEW.numar_camere, etaj = :NEW.etaj, suprafata = :NEW.suprafata, centrala_proprie = :NEW.centrala_proprie, pret_inchiriere = :NEW.pret_inchiriere, tip_confort = :NEW.tip_confort 
            WHERE id_apartament = :NEW.id_apartament AND (id_adresa <> :NEW.id_adresa OR numar_camere <> :NEW.numar_camere OR etaj <> :NEW.etaj OR suprafata <> :NEW.suprafata OR centrala_proprie <> :NEW.centrala_proprie OR pret_inchiriere <> :NEW.pret_inchiriere OR tip_confort <> :NEW.tip_confort ) ;
        ELSIF DELETING THEN
            DELETE FROM apartament_provincie@bd_provincie WHERE id_apartament = :OLD.id_apartament;
        END IF;
    else
        IF INSERTING THEN
            BEGIN
                INSERT INTO modbd_bucuresti.apartament_bucuresti VALUES (modbd_bucuresti.BUCURESTI_APARTAMENT_SEQ.NEXTVAL, :NEW.id_adresa, :NEW.numar_camere, :NEW.etaj, :NEW.suprafata, :NEW.centrala_proprie, :NEW.pret_inchiriere, :NEW.tip_confort);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE modbd_bucuresti.apartament_bucuresti SET id_adresa = :NEW.id_adresa, numar_camere = :NEW.numar_camere, etaj = :NEW.etaj, suprafata = :NEW.suprafata, centrala_proprie = :NEW.centrala_proprie, pret_inchiriere = :NEW.pret_inchiriere, tip_confort = :NEW.tip_confort 
            WHERE id_apartament = :NEW.id_apartament AND (id_adresa <> :NEW.id_adresa OR numar_camere <> :NEW.numar_camere OR etaj <> :NEW.etaj OR suprafata <> :NEW.suprafata OR centrala_proprie <> :NEW.centrala_proprie OR pret_inchiriere <> :NEW.pret_inchiriere OR tip_confort <> :NEW.tip_confort ) ;
        ELSIF DELETING THEN
            DELETE FROM modbd_bucuresti.apartament_bucuresti WHERE id_apartament = :OLD.id_apartament;
        END IF;
    end if;
END;
/

--trigger agenti imobiliari
CREATE OR REPLACE TRIGGER t_agent
INSTEAD OF INSERT OR UPDATE OR DELETE ON oltp_agent_imobiliar
FOR EACH ROW
DECLARE 
    id_agent_nextval NUMBER;
BEGIN
    id_agent_nextval := modbd_national.NATIONAL_AGENT_IMOBILIAR_SEQ.NEXTVAL;
    IF INSERTING THEN
        BEGIN
            INSERT INTO agent_imobiliar@bd_provincie VALUES (id_agent_nextval, :NEW.prenume, :NEW.nume, :NEW.email, :NEW.telefon, :NEW.data_angajare);
            INSERT INTO modbd_bucuresti.agent_imobiliar VALUES (id_agent_nextval, :NEW.prenume, :NEW.nume, :NEW.email, :NEW.telefon, :NEW.data_angajare);
            INSERT INTO modbd_national.agent_imobiliar VALUES (id_agent_nextval, :NEW.salariu, :NEW.comision);
        EXCEPTION
            WHEN DUP_VAL_ON_INDEX THEN
                NULL; -- Înregistrarea există deja, nu se face nimic
        END;
    ELSIF UPDATING THEN
        UPDATE agent_imobiliar@bd_provincie SET prenume = :NEW.prenume, nume = :NEW.nume, email = :NEW.email, telefon = :NEW.telefon, data_angajare = :NEW.data_angajare
        WHERE id_agent = :NEW.id_agent AND (prenume <> :NEW.prenume OR nume <> :NEW.nume OR email <> :NEW.email OR telefon <> :NEW.telefon OR data_angajare <> :NEW.data_angajare) ;
        
        UPDATE modbd_bucuresti.agent_imobiliar SET prenume = :NEW.prenume, nume = :NEW.nume, email = :NEW.email, telefon = :NEW.telefon, data_angajare = :NEW.data_angajare 
        WHERE id_agent = :NEW.id_agent AND (prenume <> :NEW.prenume OR nume <> :NEW.nume OR email <> :NEW.email OR telefon <> :NEW.telefon OR data_angajare <> :NEW.data_angajare) ;
        
        UPDATE modbd_national.agent_imobiliar SET salariu = :NEW.salariu, comision = :NEW.comision
        WHERE id_agent = :NEW.id_agent AND (salariu <> :NEW.salariu OR comision <> :NEW.comision) ;
    ELSIF DELETING THEN
        DELETE FROM agent_imobiliar@bd_provincie WHERE id_agent = :OLD.id_agent;
        DELETE FROM modbd_bucuresti.agent_imobiliar WHERE id_agent = :OLD.id_agent;
        DELETE FROM modbd_national.agent_imobiliar WHERE id_agent = :OLD.id_agent;
    END IF;
END;
/

-- triggeri contract
CREATE OR REPLACE TRIGGER t_contract
INSTEAD OF INSERT OR UPDATE OR DELETE ON oltp_CONTRACT
FOR EACH ROW
DECLARE
    v_in_bucuresti NUMBER := 0;
BEGIN

    select count (*) into v_in_bucuresti from modbd_bucuresti.apartament_bucuresti ap
    join modbd_bucuresti.adresa_bucuresti adr on ap.id_adresa = adr.id_adresa
    join modbd_bucuresti.localitate_bucuresti loc on adr.id_localitate = loc.id_localitate
    join modbd_bucuresti.judet_bucuresti jud on loc.id_judet = jud.id_judet
    where ap.id_apartament = :new.id_apartament AND jud.nume = 'Bucuresti';

    if v_in_bucuresti = 0 then
        IF INSERTING THEN
            BEGIN
                INSERT INTO contract_provincie@bd_provincie VALUES (PROVINCIE_CONTRACT_SEQ.NEXTVAL@bd_provincie, :NEW.id_chirias, :NEW.id_apartament, :NEW.id_agent, :NEW.data_inceput, :NEW.data_final, :NEW.ziua_scadenta, :NEW.pret_inchiriere, :NEW.valoare_estimata, :NEW.incasari);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE contract_provincie@bd_provincie SET id_chirias = :NEW.id_chirias, id_apartament = :NEW.id_apartament, id_agent = :NEW.id_agent, data_inceput = :NEW.data_inceput, data_final = :NEW.data_final, ziua_scadenta = :NEW.ziua_scadenta, pret_inchiriere = :NEW.pret_inchiriere, valoare_estimata = :NEW.valoare_estimata, incasari = :NEW.incasari  
            WHERE id_contract = :NEW.id_contract AND (id_chirias <> :NEW.id_chirias OR id_apartament <> :NEW.id_apartament OR id_agent <> :NEW.id_agent OR data_inceput <> :NEW.data_inceput OR data_final <> :NEW.data_final OR ziua_scadenta <> :NEW.ziua_scadenta OR pret_inchiriere <> :NEW.pret_inchiriere OR valoare_estimata <> :NEW.valoare_estimata OR incasari <> :NEW.incasari ) ;
        ELSIF DELETING THEN
            DELETE FROM contract_provincie@bd_provincie WHERE id_contract = :OLD.id_contract;
        END IF;
    else
        IF INSERTING THEN
            BEGIN
                INSERT INTO modbd_bucuresti.contract_bucuresti VALUES (modbd_bucuresti.BUCURESTI_CONTRACT_SEQ.NEXTVAL, :NEW.id_chirias, :NEW.id_apartament, :NEW.id_agent, :NEW.data_inceput, :NEW.data_final, :NEW.ziua_scadenta, :NEW.pret_inchiriere, :NEW.valoare_estimata, :NEW.incasari);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE modbd_bucuresti.contract_bucuresti SET id_chirias = :NEW.id_chirias, id_apartament = :NEW.id_apartament, id_agent = :NEW.id_agent, data_inceput = :NEW.data_inceput, data_final = :NEW.data_final, ziua_scadenta = :NEW.ziua_scadenta, pret_inchiriere = :NEW.pret_inchiriere, valoare_estimata = :NEW.valoare_estimata, incasari = :NEW.incasari 
            WHERE id_contract = :NEW.id_contract AND (id_chirias <> :NEW.id_chirias OR id_apartament <> :NEW.id_apartament OR id_agent <> :NEW.id_agent OR data_inceput <> :NEW.data_inceput OR data_final <> :NEW.data_final OR ziua_scadenta <> :NEW.ziua_scadenta OR pret_inchiriere <> :NEW.pret_inchiriere OR valoare_estimata <> :NEW.valoare_estimata OR incasari <> :NEW.incasari ) ;
        ELSIF DELETING THEN
            DELETE FROM modbd_bucuresti.contract_bucuresti WHERE id_contract = :OLD.id_contract;
        END IF;
    end if;
END;
/

-- triggeri plata chirie
CREATE OR REPLACE TRIGGER t_plata_chirie
INSTEAD OF INSERT OR UPDATE OR DELETE ON oltp_plata_chirie
FOR EACH ROW
DECLARE
    v_in_bucuresti NUMBER := 0;
BEGIN

    select count (*) into v_in_bucuresti from modbd_bucuresti.contract_bucuresti c
    join modbd_bucuresti.apartament_bucuresti ap on c.id_apartament = ap.id_apartament
    join modbd_bucuresti.adresa_bucuresti adr on ap.id_adresa = adr.id_adresa
    join modbd_bucuresti.localitate_bucuresti loc on adr.id_localitate = loc.id_localitate
    join modbd_bucuresti.judet_bucuresti jud on loc.id_judet = jud.id_judet
    where c.id_contract = :new.id_contract AND jud.nume = 'Bucuresti';
    
    if v_in_bucuresti = 0 then
        IF INSERTING THEN
            BEGIN
                INSERT INTO plata_chirie_provincie@bd_provincie VALUES (PROVINCIE_PLATA_CHIRIE_SEQ.NEXTVAL@bd_provincie, :NEW.id_contract, :NEW.luna, :NEW.an, :NEW.suma, :NEW.data_efectuarii, :NEW.nr_zile_intarziere);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE plata_chirie_provincie@bd_provincie SET id_contract = :NEW.id_contract, luna = :NEW.luna, an = :NEW.an, suma = :NEW.suma, data_efectuarii = :NEW.data_efectuarii, nr_zile_intarziere = :NEW.nr_zile_intarziere  
            WHERE id_plata = :NEW.id_plata AND (id_contract <> :NEW.id_contract OR luna <> :NEW.luna OR an <> :NEW.an OR suma <> :NEW.suma OR data_efectuarii <> :NEW.data_efectuarii OR nr_zile_intarziere <> :NEW.nr_zile_intarziere) ;
        ELSIF DELETING THEN
            DELETE FROM plata_chirie_provincie@bd_provincie WHERE id_plata = :OLD.id_plata;
        END IF;
    else
        IF INSERTING THEN
            BEGIN
                INSERT INTO modbd_bucuresti.plata_chirie_bucuresti VALUES (modbd_bucuresti.BUCURESTI_PLATA_CHIRIE_SEQ.NEXTVAL, :NEW.id_contract, :NEW.luna, :NEW.an, :NEW.suma, :NEW.data_efectuarii, :NEW.nr_zile_intarziere);
            EXCEPTION
                WHEN DUP_VAL_ON_INDEX THEN
                    NULL; -- Înregistrarea există deja, nu se face nimic
            END;
        ELSIF UPDATING THEN
            UPDATE modbd_bucuresti.plata_chirie_bucuresti SET id_contract = :NEW.id_contract, luna = :NEW.luna, an = :NEW.an, suma = :NEW.suma, data_efectuarii = :NEW.data_efectuarii, nr_zile_intarziere = :NEW.nr_zile_intarziere  
            WHERE id_plata = :NEW.id_plata AND (id_contract <> :NEW.id_contract OR luna <> :NEW.luna OR an <> :NEW.an OR suma <> :NEW.suma OR data_efectuarii <> :NEW.data_efectuarii OR nr_zile_intarziere <> :NEW.nr_zile_intarziere) ;
        ELSIF DELETING THEN
            DELETE FROM modbd_bucuresti.plata_chirie_bucuresti WHERE id_plata = :OLD.id_plata;
        END IF;
    end if;
END;
/