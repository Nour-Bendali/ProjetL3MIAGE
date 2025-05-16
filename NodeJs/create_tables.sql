-- Création de la table CompetencesMissions
CREATE TABLE IF NOT EXISTS CompetencesMissions (
    IdMission INT NOT NULL,
    IdCompetence INT NOT NULL,
    PRIMARY KEY (IdMission, IdCompetence),
    FOREIGN KEY (IdMission) REFERENCES Missions(IdMission) ON DELETE CASCADE,
    FOREIGN KEY (IdCompetence) REFERENCES Competences(IdentifiantC) ON DELETE CASCADE
);

-- Création de la table MissionsPersonnel si elle n'existe pas
CREATE TABLE IF NOT EXISTS MissionsPersonnel (
    IdMission INT NOT NULL,
    IdPersonnel INT NOT NULL,
    PRIMARY KEY (IdMission, IdPersonnel),
    FOREIGN KEY (IdMission) REFERENCES Missions(IdMission) ON DELETE CASCADE,
    FOREIGN KEY (IdPersonnel) REFERENCES Personnel(Identifiant) ON DELETE CASCADE
); 