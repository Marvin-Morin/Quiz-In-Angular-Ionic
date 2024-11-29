export function levelDifficulty(): string {

    const difficultys = [
        "easy",
        "medium",
        "hard"
    ]

    const randomIndex = Math.floor(Math.random() * difficultys.length)

    return difficultys[randomIndex]
}