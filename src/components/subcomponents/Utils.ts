export type PositionInStaff = number;

export const LINE_HEIGHT = 12;

export function positionInStaffToY(position: PositionInStaff) {
    return position * LINE_HEIGHT;
}

export function flattenArray<T>(arrays: Array<Array<T>>): Array<T> {
    const result: Array<T> = [];
    return result.concat.apply([], arrays);
}

export function cluster<Placed extends {staffPosition: PositionInStaff}>(objectsInStaff: Array<Placed>, maxDiffInCluster = 1) {
    const clusters: Array<Array<Placed>> = [];
    let currentCluster: Array<Placed> = [];
    for (let i = 0; i < objectsInStaff.length; i++) {
        const currentTone = objectsInStaff[i];
        const previousTone = i > 0 && objectsInStaff[i - 1];
        if (previousTone && (previousTone.staffPosition - currentTone.staffPosition > maxDiffInCluster)) {
            // End cluster
            clusters.push(currentCluster);
            currentCluster = [];
        }
        currentCluster.push(currentTone);
    }
    clusters.push(currentCluster);
    return clusters;
}

