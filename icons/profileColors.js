export const PROFILE_COLORS = [
    '#810100',
    '#fb6058',
    '#ffd979',
    '#ffada8',
    '#3c78d8ff',
    '#91e3e6ff',
    '#8e7cc3ff',
    '#b6d7a8ff',
    '#ce0f0f',
    '#a81494',
    '#2aca75',
];

export function getAvailableColor(memberColors = {}) {
    const usedColors = Object.values(memberColors);

    const availableColors = PROFILE_COLORS.filter(
        color => !usedColors.includes(color)
    );

    if (availableColors.length === 0){
        throw new Error("No remaining profile colors for this group");
    }

    const randomIndex = Math.floor(
        Math.random() * availableColors.length
    );

    return availableColors[randomIndex];
}