export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

export const getInitials = (name) => {
    if (!name) return ""

    const words = name.split("")
    let initials = ""

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0]
    }

    return initials.toLocaleUpperCase()
}

export const addThousandSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");

    // Apply the Indian numbering format
    let lastThree = integerPart.slice(-3);
    let rest = integerPart.slice(0, -3);

    if (rest) {
        rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    }

    const formattedInteger = rest ? `${rest},${lastThree}` : lastThree;

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
}

export const prepareExpsenseChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount,
    }))

    return chartData
}