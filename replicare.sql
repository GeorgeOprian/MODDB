-- provincie
CREATE OR REPLACE TRIGGER trig_rep_chirias
AFTER INSERT OR UPDATE OR DELETE ON chirias
FOR EACH ROW
DECLARE
    v_dummy NUMBER;
BEGIN
    IF INSERTING THEN
        BEGIN
            INSERT INTO CHIRIAS@bd_bucuresti VALUES (:NEW.id_chirias, :NEW.prenume, :NEW.nume, :NEW.telefon, :NEW.email, :NEW.sex, :NEW.data_nastere, :NEW.starea_civila);
        EXCEPTION
            WHEN DUP_VAL_ON_INDEX THEN
                NULL; -- Înregistrarea există deja, nu se face nimic
        END;
    ELSIF UPDATING THEN
        UPDATE CHIRIAS@bd_bucuresti SET prenume = :NEW.prenume, nume = :NEW.nume, telefon = :NEW.telefon, email = :NEW.email, sex = :NEW.sex, data_nastere = :NEW.data_nastere, starea_civila = :NEW.starea_civila 
        WHERE id_chirias = :NEW.id_chirias AND (prenume <> :NEW.prenume OR nume <> :NEW.nume OR telefon <> :NEW.telefon OR email <> :NEW.email OR sex <> :NEW.sex OR data_nastere <> :NEW.data_nastere OR starea_civila <> :NEW.starea_civila );
    ELSIF DELETING THEN
        DELETE FROM CHIRIAS@bd_bucuresti WHERE id_chirias = :OLD.id_chirias;
    END IF;
END;
/

--bucuresti
CREATE OR REPLACE TRIGGER trig_rep_chirias_bucuresti
AFTER INSERT OR UPDATE OR DELETE ON chirias
FOR EACH ROW
DECLARE
    v_dummy NUMBER;
BEGIN
    IF INSERTING THEN
        BEGIN
            INSERT INTO CHIRIAS@bd_provincie VALUES (:NEW.id_chirias, :NEW.prenume, :NEW.nume, :NEW.telefon, :NEW.email, :NEW.sex, :NEW.data_nastere, :NEW.starea_civila);
        EXCEPTION
            WHEN DUP_VAL_ON_INDEX THEN
                NULL; -- Înregistrarea există deja, nu se face nimic
        END;
    ELSIF UPDATING THEN
        UPDATE CHIRIAS@bd_provincie SET prenume = :NEW.prenume, nume = :NEW.nume, telefon = :NEW.telefon, email = :NEW.email, sex = :NEW.sex, data_nastere = :NEW.data_nastere, starea_civila = :NEW.starea_civila 
        WHERE id_chirias = :NEW.id_chirias AND (prenume <> :NEW.prenume OR nume <> :NEW.nume OR telefon <> :NEW.telefon OR email <> :NEW.email OR sex <> :NEW.sex OR data_nastere <> :NEW.data_nastere OR starea_civila <> :NEW.starea_civila ) ;
    ELSIF DELETING THEN
        DELETE FROM CHIRIAS@bd_provincie WHERE id_chirias = :OLD.id_chirias;
    END IF;
END;
/