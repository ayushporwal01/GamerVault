
export const romanToNumber = (s) => {
    const roman = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    let ans = 0;
    for (let i = s.length - 1; i >= 0; i--) {
        let num = roman[s.charAt(i).toUpperCase()];
        if (4 * num < ans) ans -= num;
        else ans += num;
    }
    return ans;
};

export const normalizeTitle = (title) => {
    if (typeof title !== 'string') return '';
    return title.toLowerCase().replace(/\b([IVXLCDM]+)\b/g, (match) => {
        return romanToNumber(match);
    }).replace(/[^a-z0-9\s]/g, '').trim();
};

