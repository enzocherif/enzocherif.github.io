% Définition des constantes

% Gravité
g = 9.81; % m/s^2

% Vitesse initiale de la voiture
v0 = 27.77; % m/s

% Rayon de la roue
rRoue = 0.3; % m

% Moment d'inertie de la roue
J = 0.5; % kg.m^2

% Masse de la voiture
m = 1000; % kg

% Coefficient de frottement maximal
f = 0.8;

% Paramètres du PID
Kp = 100;      % Gain proportionnel
Ki = 10;        % Constante de temps intégrale (pour le terme intégral 1/Ti)
Kd = 0;      % Constante de temps dérivée
Ts = 0,0001;

(m*g*f)/(4);

% Paramètres fixes du véhicule
g = 9.81;                 % Gravité (m/s^2)
h = 0.7;                  % Hauteur du centre de gravité par rapport au sol (m)
d_avant = 1.5;            % Distance du centre de gravité au train avant (m)
d_arriere = 1.5;          % Distance du centre de gravité au train arrière (m)
L = d_avant + d_arriere;  % Empattement du véhicule (distance totale entre les trains avant et arrière) (m)
m = 1000;                 % Masse totale du véhicule (kg)

% Accélération pour le cas de freinage d'urgence
a = -5;                   % Accélération due au freinage d'urgence (m/s^2)

% Calcul des forces normales
N_avant = m * g * (d_arriere / L) - m * a * (h / L);  % Force normale sur le train avant
N_arriere = m * g * (d_avant / L) + m * a * (h / L);  % Force normale sur le train arrière

Km=10;
Tm=0.1;
