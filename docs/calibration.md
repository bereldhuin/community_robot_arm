# config.h

## Définir le type de carte

- `#define BOARD_CHOICE MEGA2560`

## Définir la présence de fin de contact

- `#define HOME_<axe>_STEPPER`

## Déifnir le ratio entre les routes dentées/courroies

- `#define MOTOR_GEAR_TEETH`
- `#define MAIN_GEAR_TEETH`

## Définir le type de gripper

- `#define GRIPPER BYJ`

## Afficher les logs

- `#define PRINT_REPLY true`

# Calibration

- Désactiver les steppers (`M18`)
- Placer le bras comme suit :
  - Bras inférieur : le plus en arrière possible, contre la butée
  - Bras supérieur : le plus haut possible, contre la butée
- Réactiver les steppers (`M17`)
- Lancer le homing (`G28`)
  => les bras doivent être à angle droit

- Vérifier la position du gripper (face inférieure du support):

  - X : 0
  - Y : 174 (`HIGH_SHANK_LENGTH` + `END_EFFECTOR_OFFSET`)
  - Z: 120 (donc 260 depuis la base du bras)

- Ajuster les paramètres suivants pour assurer la position ci-dessus (_attention, X, Y et Z ne correspondent pas aux positions XYZ ci-dessous, mais aux bras_):
  - `#define X_HOME_STEPS 500 ` : bras supérieur
  - `#define Y_HOME_STEPS 1500` : bras inférieur
  - `#define Z_HOME_STEPS 3640` : pivot
