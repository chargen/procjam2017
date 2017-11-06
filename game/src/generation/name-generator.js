"use strict";

var makeGenerator = require('ngram-word-generator'),
    seedRandom = require('seed-random'),
    ngramModel = require('./models/track-name-model.json'),
    generator = makeGenerator(ngramModel);

var greekLetters = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Digamma',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omicron',
    'Pi',
    'Rho',
    'Sigma',
    'Tau',
    'Upsilon',
    'Phi',
    'Chi',
    'Psi',
    'Omega'
];

function nameGenerator (seed) {
    var rng = seedRandom(seed);

    var base = generator(5 + rng() * 5, rng),
        finalName;

    base = base[0].toUpperCase() + base.substr(1);

    if (rng() < 0.666) {
        // apply 'bayer designation' style

        var lastLetter = base.substr(-1);
        if (lastLetter === 'a') {
            base += 'e';
        } else if (lastLetter === 'e') {
            base = base.substr(0, base.length-1) + (rng() > 0.5 ? 'is' : 'i');
        }

        var prefix = greekLetters[greekLetters.length * Math.pow(rng(), 2.2) | 0];

        var number = Math.pow(rng(), 3) * 1000 | 0;

        if (number > 0 && number < 7) {
            prefix += ' ' + number;
        }

        finalName = prefix + ' ' + base;
    } else {
        finalName = base;
    }

    if (finalName.length < 18) {
        var suffixProba = rng() * 10;

        if (suffixProba < 0.5) {
            finalName += ' Minoris';
        } else if (suffixProba < 1.0) {
            finalName += ' Majoris';
        }
    }

    return finalName;
}

module.exports = nameGenerator;