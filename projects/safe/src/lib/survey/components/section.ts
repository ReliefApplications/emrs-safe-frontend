export function init(Survey: any): void {
    const component = {
      // Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
      name: 'section',
      // The text that shows on toolbox
      title: 'Section',
      category: 'Custom Questions',
      // The actual question that will do the job
      questionJSON: {
        type: 'html',
      },
      onInit(): void {
      },
      onLoaded(question: any): void {
        question.titleLocation = 'hidden';
      },
    };
    Survey.ComponentCollection.Instance.add(component);
  }
