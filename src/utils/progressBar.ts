/**
 * @see https://github.com/Mw3y/Text-ProgressBar/blob/master/ProgressBar.js
 */
export default function progressBar({
    value,
    max,
    size = 10,
    char = '▇',
}: {
    value: number;
    max: number;
    size?: number;
    char?: string;
}) {
    const percentage = value / max; // Calculate the percentage of the bar
    const progress = Math.round(size * percentage); // Calculate the number of square caracters to fill the progress side.
    const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.

    const progressText = char.repeat(progress); // Repeat is creating a string with progress * caracters in it
    const emptyProgressText = '—'.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it

    const bar = '[' + progressText + emptyProgressText + ']' + value; // Creating the bar
    return bar;
}
