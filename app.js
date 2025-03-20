// Liste des Pokémon disponibles
const pokemons = [
    {
        name: "Pikachu",
        hp: 100,
        attack: 50,
        defense: 40,
        specialAttack: 55,
        specialDefense: 45,
        speed: 90,
        type: "Électrik",
        image: "assets/pikachu.png", // Chemin d'accès correct
        attacks: [
            { name: "Éclair", power: 90, isSpecial: true, type: "Électrik", pp: 15 },
            { name: "Tacle", power: 40, isSpecial: false, type: "Normal", pp: 35 },
            { name: "Tonnerre", power: 110, isSpecial: true, type: "Électrik", pp: 10 },
            { name: "Vive Attaque", power: 40, isSpecial: false, type: "Normal", pp: 30 }
        ]
    },
    {
        name: "Bulbizarre",
        hp: 100,
        attack: 50,
        defense: 40,
        specialAttack: 65,
        specialDefense: 65,
        speed: 60,
        type: "Plante",
        image: "assets/bulbasaur.png", // Chemin d'accès correct
        attacks: [
            { name: "Fouet Lianes", power: 45, isSpecial: false, type: "Plante", pp: 25 },
            { name: "Vampigraine", power: 0, isSpecial: true, type: "Plante", pp: 10 },
            { name: "Rugissement", power: 0, isSpecial: false, type: "Normal", pp: 40 },
            { name: "Tranch'Herbe", power: 55, isSpecial: true, type: "Plante", pp: 25 }
        ]
    },
    {
        name: "Évoli",
        hp: 100,
        attack: 55,
        defense: 50,
        specialAttack: 45,
        specialDefense: 65,
        speed: 55,
        type: "Normal",
        image: "assets/evoli.png", // Chemin d'accès correct
        attacks: [
            { name: "Charge", power: 40, isSpecial: false, type: "Normal", pp: 35 },
            { name: "Mimi-Queue", power: 0, isSpecial: false, type: "Normal", pp: 30 },
            { name: "Vive Attaque", power: 40, isSpecial: false, type: "Normal", pp: 30 },
            { name: "Léchouille", power: 30, isSpecial: false, type: "Spectre", pp: 30 }
        ]
    },
    {
        name: "Salamèche",
        hp: 100,
        attack: 52,
        defense: 43,
        specialAttack: 60,
        specialDefense: 50,
        speed: 65,
        type: "Feu",
        image: "assets/salameche.png", // Chemin d'accès correct
        attacks: [
            { name: "Flammèche", power: 40, isSpecial: true, type: "Feu", pp: 25 },
            { name: "Griffe", power: 40, isSpecial: false, type: "Normal", pp: 35 },
            { name: "Déflagration", power: 110, isSpecial: true, type: "Feu", pp: 5 },
            { name: "Lance-Flammes", power: 90, isSpecial: true, type: "Feu", pp: 15 }
        ]
    },
    {
        name: "Psykokwak",
        hp: 100,
        attack: 52,
        defense: 48,
        specialAttack: 65,
        specialDefense: 50,
        speed: 55,
        type: "Eau",
        image: "assets/psyduck.png", // Chemin d'accès correct
        attacks: [
            { name: "Pistolet à O", power: 40, isSpecial: true, type: "Eau", pp: 25 },
            { name: "Choc Mental", power: 50, isSpecial: true, type: "Psy", pp: 25 },
            { name: "Hydrocanon", power: 110, isSpecial: true, type: "Eau", pp: 5 },
            { name: "Amnésie", power: 0, isSpecial: false, type: "Psy", pp: 20 }
        ]
    }
];

let playerTeam = [
    { ...pokemons[0] }, // Pikachu
    { ...pokemons[1] }, // Bulbizarre
    { ...pokemons[2] }  // Évoli
];

let opponentTeam = [
    { ...pokemons[3] }, // Salamèche
    { ...pokemons[4] }  // Psykokwak
];

let player;
let opponent;

const typeChart = {
    "Feu": { "Eau": 0.5, "Plante": 2, "Feu": 0.5, "Glace": 2, "Insecte": 2, "Roche": 0.5, "Dragon": 0.5 },
    "Eau": { "Feu": 2, "Plante": 0.5, "Eau": 0.5, "Sol": 2, "Roche": 2, "Dragon": 0.5 },
    "Plante": { "Feu": 0.5, "Eau": 2, "Plante": 0.5, "Vol": 0.5, "Poison": 0.5, "Insecte": 0.5, "Sol": 2, "Roche": 2, "Dragon": 0.5 },
    "Électrik": { "Eau": 2, "Plante": 0.5, "Électrik": 0.5, "Sol": 0, "Vol": 2, "Dragon": 0.5 },
    "Normal": { "Combat": 0.5, "Spectre": 0, "Roche": 0.5 },
    "Psy": { "Combat": 0.5, "Psy": 0.5, "Insecte": 2, "Spectre": 2, "Ténèbres": 2 },
    "Spectre": { "Normal": 0, "Psy": 2, "Spectre": 2, "Ténèbres": 0.5 },
    // Ajoutez d'autres types ici
};

function calculateDamage(attacker, defender, attack) {
    const level = 50;
    const attackStat = attack.isSpecial ? attacker.specialAttack : attacker.attack;
    const defenseStat = attack.isSpecial ? defender.specialDefense : defender.defense;
    const power = attack.power;

    const isCritical = Math.random() < 0.0625; // 6.25% de chance de coup critique
    const criticalModifier = isCritical ? 1.5 : 1;

    const baseDamage = ((2 * level + 10) / 250) * (attackStat / defenseStat) * power + 2;
    const modifier = calculateModifier(attacker, defender, attack) * criticalModifier;
    const damage = Math.floor(baseDamage * modifier);

    if (isCritical) {
        log("Coup critique !");
    }

    return damage;
}

function calculateModifier(attacker, defender, attack) {
    let modifier = 1;
    const effectiveness = getEffectiveness(attack.type, defender.type);
    modifier *= effectiveness;
    return modifier;
}

function getEffectiveness(attackType, defenderType) {
    return typeChart[attackType][defenderType] || 1;
}

function useAttack(attacker, defender, attack) {
    if (attack.pp > 0) {
        attack.pp--;
        const damage = calculateDamage(attacker, defender, attack);
        defender.hp = Math.max(0, defender.hp - damage);
        log(`${attacker.name} a utilisé ${attack.name} !`);

        // Effets spéciaux des attaques
        if (attack.name === "Rugissement") {
            defender.attack = Math.max(0, defender.attack - 1);
            log(`${defender.name} a perdu un point d'Attaque !`);
        }

        updateStats();
        if (defender.hp <= 0) {
            endBattle(attacker);
        }
    } else {
        log(`${attacker.name} n'a plus de PP pour ${attack.name} !`);
    }
}

function determineAttackOrder(player, opponent) {
    if (player.speed > opponent.speed) {
        return { first: player, second: opponent };
    } else {
        return { first: opponent, second: player };
    }
}

function battleTurn(player, opponent) {
    const { first, second } = determineAttackOrder(player, opponent);

    useAttack(first, second);
    if (second.hp > 0) {
        useAttack(second, first);
    }
}

function log(message) {
    let logDiv = document.getElementById("log");
    let logMessage = document.createElement("p");
    logMessage.textContent = message;
    logDiv.appendChild(logMessage);
}

function updateStats() {
    document.getElementById("player-hp").textContent = player.hp;
    document.getElementById("opponent-hp").textContent = opponent.hp;
    document.getElementById("player-pp").textContent = player.attacks.map(a => a.pp).join("/");
    document.getElementById("opponent-pp").textContent = opponent.attacks.map(a => a.pp).join("/");

    // Mettre à jour les images des Pokémon
    document.getElementById("player-image").src = player.image;
    document.getElementById("opponent-image").src = opponent.image;

    // Mettre à jour les jauges de vie
    updateHealthBar("player-health-bar", player.hp, 100); // 100 est le PV max
    updateHealthBar("opponent-health-bar", opponent.hp, 100); // 100 est le PV max
}

function updateHealthBar(barId, currentHp, maxHp) {
    const healthBar = document.getElementById(barId);
    const percentage = (currentHp / maxHp) * 100;
    healthBar.style.width = `${percentage}%`;

    // Changer la couleur de la jauge si les PV sont bas
    if (percentage <= 25) {
        healthBar.classList.add("low");
    } else {
        healthBar.classList.remove("low");
    }
}

function endBattle(winner) {
    alert(`${winner.name} a gagné !`);
    location.reload();
}

function startBattle() {
    document.getElementById("selection-screen").style.display = "none";
    document.getElementById("battle-screen").style.display = "block";
    updateStats();
    updateAttackButtons();
}

function updateAttackButtons() {
    const attackButtons = document.querySelectorAll(".attacks button");
    player.attacks.forEach((attack, index) => {
        attackButtons[index].textContent = `${attack.name} (${attack.pp})`;
        if (attack.pp <= 0) {
            attackButtons[index].disabled = true;
            attackButtons[index].style.opacity = 0.5;
        } else {
            attackButtons[index].disabled = false;
            attackButtons[index].style.opacity = 1;
        }
    });
}

function openSwitchMenu() {
    const switchMenu = document.getElementById("switch-menu");
    switchMenu.innerHTML = "";
    playerTeam.forEach(pokemon => {
        if (pokemon.hp > 0 && pokemon.name !== player.name) {
            const button = document.createElement("button");
            button.textContent = pokemon.name;
            button.addEventListener("click", () => {
                switchPokemon(pokemon);
                switchMenu.style.display = "none";
            });
            switchMenu.appendChild(button);
        }
    });
    switchMenu.style.display = "block";
}

function switchPokemon(newPokemon) {
    if (player.hp > 0) {
        player = newPokemon;
        log(`Vous avez envoyé ${newPokemon.name} !`);
        updateStats();
        updateAttackButtons();
    } else {
        log("Vous ne pouvez pas changer de Pokémon !");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const pokemonSelection = document.getElementById("pokemon-selection");
    pokemons.forEach(pokemon => {
        const button = document.createElement("button");
        button.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}" width="50"><br>${pokemon.name}`;
        button.addEventListener("click", () => {
            player = { ...pokemon };
            opponent = { ...pokemons[Math.floor(Math.random() * pokemons.length)] };
            while (opponent.name === player.name) {
                opponent = { ...pokemons[Math.floor(Math.random() * pokemons.length)] };
            }
            startBattle();
        });
        pokemonSelection.appendChild(button);
    });

    const attackButtons = document.querySelectorAll(".attacks button");
    attackButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (player.hp > 0 && opponent.hp > 0) {
                useAttack(player, opponent, player.attacks[index]);
                if (opponent.hp > 0) {
                    opponentTurn();
                }
            }
        });
    });

    document.getElementById("switch-button").addEventListener("click", openSwitchMenu);
    document.getElementById("end-battle").addEventListener("click", () => location.reload());
});

function opponentTurn() {
    const attack = opponent.attacks[Math.floor(Math.random() * opponent.attacks.length)];
    useAttack(opponent, player, attack);
}