import rankedChoiceAlgorithm from '../rankedChoiceAlgorithm';

const algo = (votes: string[], debug?: boolean) => {
    const result = rankedChoiceAlgorithm(votes.map(x => x.split('')));
    if (debug) console.dir(result, { depth: 10 });
    return result;
};

test('works with straight up win in round 1', () => {
    expect(algo(['abc', 'bcd', 'bca'])).toHaveProperty('result', 'b');
});

test('works with straight up win in round 2', () => {
    expect(algo(['ab', 'bc', 'cb'])).toHaveProperty('result', 'b');
});

test('tiebreaker based on position', () => {
    expect(algo(['a', 'b', 'xa'])).toHaveProperty('result', 'a');
});
