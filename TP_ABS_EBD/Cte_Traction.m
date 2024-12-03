% Motor parameters
L = 0.0005; % H
R = 0.01; % Ohms
Kb = 0.7; % V/rad/s
Km = Kb; % N.m/A
J = 0.5; % kg.m^2
b = 0.00005; % N.m.s
fc = 0.01; % N.m

% Car/traction parameters
m = 1500; % kg
Rw = 0.3; % m
g = 9.81; % m/s^2
Q = 0.25; % Drag coefficient
GR = 1; % Gear ratio

% Initial conditions
i_0 = 0; % A
wm_0 = 0; % rad/s
tht_0 = 0; % rad
v_0 = 0; % m/s
xp = 0; % m

% Desired speed (speed up to)
wm_des = 213; % rad/s (corresponding to 261 km/h for Tesla Model 3)

% Desired speed (slow down to)
wm_des2 = 41; % rad/s (corresponding to 50 km/h)

% Input voltage
u1 = 400; % Tesla's high-voltage battery (400 V constant)
