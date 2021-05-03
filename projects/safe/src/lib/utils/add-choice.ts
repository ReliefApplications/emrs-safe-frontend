export default function addChoice(object: any, question: string, value: string): void {
    if (object.elements) {
        for (const element of object.elements) {
            if (element.type === 'panel') {
                addChoice(element, question, value);
            } else {
                if (element.name === question) {
                    element.choices.push(value);
                }
            }
        }
    }
}
