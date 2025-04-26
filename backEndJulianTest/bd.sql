
USE recruitmiage;

-- Table des utilisateurs
CREATE TABLE Utilisateurs (
    IDutilisateur INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(50),
    Prenom VARCHAR(50),
    Mail VARCHAR(100) UNIQUE
);

-- Table des projets
CREATE TABLE Projets (
    IDProjet INT AUTO_INCREMENT PRIMARY KEY,
    NomP VARCHAR(100),
    descriptionP TEXT,
    IDUtilisateur INT,
    FOREIGN KEY (IDUtilisateur) REFERENCES Utilisateurs(IDutilisateur) ON DELETE CASCADE
);

-- Table des invitations (pour inviter des utilisateurs à rejoindre un projet)
CREATE TABLE Inviter (
    IDUtilisateur INT,
    IDUtilisateur2 INT,
    IDProjet INT,
    PRIMARY KEY (IDUtilisateur, IDUtilisateur2, IDProjet),
    FOREIGN KEY (IDUtilisateur) REFERENCES Utilisateurs(IDutilisateur) ON DELETE CASCADE,
    FOREIGN KEY (IDUtilisateur2) REFERENCES Utilisateurs(IDutilisateur) ON DELETE CASCADE,
    FOREIGN KEY (IDProjet) REFERENCES Projets(IDProjet) ON DELETE CASCADE
);

-- Table pour gérer l'appartenance des utilisateurs aux projets
CREATE TABLE PcontenirU (
    IDProjet INT,
    IDUtilisateur INT,
    PRIMARY KEY (IDProjet, IDUtilisateur),
    FOREIGN KEY (IDProjet) REFERENCES Projets(IDProjet) ON DELETE CASCADE,
    FOREIGN KEY (IDUtilisateur) REFERENCES Utilisateurs(IDutilisateur) ON DELETE CASCADE
);

-- Table des dossiers (un utilisateur peut créer des dossiers pour organiser ses projets)
CREATE TABLE Dossier (
    IDdossier INT AUTO_INCREMENT PRIMARY KEY,
    NomDossier VARCHAR(100),
    IDUtilisateur INT,
    FOREIGN KEY (IDUtilisateur) REFERENCES Utilisateurs(IDutilisateur) ON DELETE CASCADE
);

-- Table pour lier les projets aux dossiers
CREATE TABLE DcontenirP (
    IDdossier INT,
    IDProjet INT,
    PRIMARY KEY (IDdossier, IDProjet),
    FOREIGN KEY (IDdossier) REFERENCES Dossier(IDdossier) ON DELETE CASCADE,
    FOREIGN KEY (IDProjet) REFERENCES Projets(IDProjet) ON DELETE CASCADE
);

