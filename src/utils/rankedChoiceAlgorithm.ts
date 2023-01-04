import _ from 'lodash';

export default function rankedChoiceAlgorithm(votes: string[][]) {
    const winThreshold = Math.ceil((votes.length + 1) / 2);
    const voteScores: Record<string, number> = {}; // used for tie-breakers

    let pending = votes.map((list, user) => list.map(vote => ({ vote, user })));
    const maxIterations = _.uniqBy(pending.flat(), 'vote').length;
    votes.forEach(list =>
        list.forEach((vote, index) => {
            voteScores[vote] = (voteScores[vote] || 0) + maxIterations - index;
        }),
    );
    const originalVoteScores = { ...voteScores };

    let result!: string;
    const rounds: Array<{
        candidates: string[];
        votes: string[][];
        remove?: string;
        sorted: any[];
    }> = [];

    for (let i = 0; i < maxIterations; ++i) {
        const counts: Record<string, number> = {
            ...Object.fromEntries(_.map(voteScores, (_v, k) => [k, 0])),
            ..._.countBy(pending, '0.vote'),
        };
        const sorted = _.sortBy(
            _.map(counts, (count, vote) => ({
                vote,
                count,
                score: count * 100 + voteScores[vote], // weighted tie-breaker based on positions
            })),
            'score',
        ).reverse();

        rounds.push({
            candidates: Object.keys(voteScores),
            votes: votes.map(list => list.filter(v => voteScores[v])),
            sorted,
        });

        // straight win
        if (sorted[0].count >= winThreshold) {
            result = sorted[0].vote;
            break;
        }

        // 2-way tie
        if (sorted.length === 2 && sorted[0].score === sorted[1].score) {
            result = sorted[0].vote; // return 1st entry
            break;
        }

        // shouldn't technically happen but whatever
        if (sorted.length === 1) {
            result = sorted[0].vote;
            break;
        }

        const remove = _.last(sorted)!.vote;
        delete voteScores[remove];
        _.last(rounds)!.remove = remove;
        pending = pending.map(list => list.filter(v => v.vote !== remove)).filter(x => x.length);
    }

    return {
        result,
        maxIterations,
        voteScores: originalVoteScores,
        rounds,
    };
}
