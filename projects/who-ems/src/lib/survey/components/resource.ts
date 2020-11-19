const API_GRAPHQL = `http://localhost:3000/graphql`;

export function init(Survey: any): void {
  const component = {
    name: 'resource',
    title: 'Resource',
    questionJSON: {
      name: 'resource',
      type: 'dropdown',
      optionsCaption: 'Select a resource...',
      choicesOrder: 'asc',
      choices: [],
    },
    onInit(): void {
      Survey.Serializer.addProperty('resource', {
        name: 'resource',
        category: 'Resource',
        visibleIndex: 3,
        required: true,
        choices: (obj, choicesCallback) => {
          const url = API_GRAPHQL;
          const xhr = new XMLHttpRequest();
          const query = {
            query: `{
                            resources {
                              id
                              name
                            }
                          }`,
          };
          xhr.responseType = 'json';
          xhr.open('POST', url);
          const token = localStorage.getItem('msal.idtoken');
          // Apollo client doesn't intercept the request, so it has to be built 'manually'
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = () => {
            const serverRes = xhr.response.data.resources;
            const res = [];
            res.push({ value: null });
            for (const item of serverRes) {
              res.push({ value: item.id, text: item.name });
            }
            choicesCallback(res);
          };
          xhr.send(JSON.stringify(query));
        },
      });
      Survey.Serializer.addProperty('resource', {
        name: 'displayField',
        category: 'Resource',
        dependsOn: 'resource',
        required: true,
        visibleIf: (obj) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj, choicesCallback) => {
          if (obj.resource) {
            const url = API_GRAPHQL;
            const xhr = new XMLHttpRequest();
            const query = {
              query: `
                                  query GetResourceById($id: ID!) {
                                    resource(id: $id) {
                                        id
                                        name
                                        fields
                                      }
                                  }`,
              variables: {
                id: obj.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', url);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.fields;
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.name });
              }
              choicesCallback(res);
            };
            xhr.send(JSON.stringify(query));
          }
        },
      });
      Survey.Serializer.addProperty('resource', {
        name: 'test service',
        category: 'Resource',
        dependsOn: ['resource', 'displayField'],
        required: true,
        visibleIf: (obj) => {
          if (!obj || !obj.resource || !obj.displayField) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj, choicesCallback) => {
          if (obj.resource) {
            const url = API_GRAPHQL;
            const xhr = new XMLHttpRequest();
            const query = {
              query: `
                                  query GetResourceById($id: ID!) {
                                    resource(id: $id) {
                                        id
                                        name
                                        records {
                                            id
                                            data
                                        }
                                      }
                                  }`,
              variables: {
                id: obj.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', url);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.records;
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.data[obj.displayField] });
              }
              choicesCallback(res);
            };
            xhr.send(JSON.stringify(query));
          }
        },
      });
      Survey.Serializer.addProperty('resource', {
        name: 'canAddNew:boolean',
        category: 'Resource',
        dependsOn: ['resource'],
        visibleIf: (obj) => {
          if (!obj || !obj.resource) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
      });
      Survey.Serializer.addProperty('resource', {
        name: 'addTemplate',
        category: 'Resource',
        dependsOn: 'canAddNew',
        visibleIf: (obj) => {
          if (!obj || !obj.canAddNew) {
            return false;
          } else {
            return true;
          }
        },
        visibleIndex: 3,
        choices: (obj, choicesCallback) => {
          if (obj.resource && obj.canAddNew) {
            const url = API_GRAPHQL;
            const xhr = new XMLHttpRequest();
            const query = {
              query: `
                                  query GetResourceById($id: ID!) {
                                    resource(id: $id) {
                                        id
                                        name
                                        forms {
                                            id
                                            name
                                        }
                                      }
                                  }`,
              variables: {
                id: obj.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', url);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.forms;
              const res = [];
              res.push({ value: null });
              for (const item of serverRes) {
                res.push({ value: item.id, text: item.name });
              }
              choicesCallback(res);
            };
            xhr.send(JSON.stringify(query));
          }
        },
      });
    },
    onLoaded(question): void {
      const url = API_GRAPHQL;
      const xhr = new XMLHttpRequest();
      const query = {
        query: `query GetResourceById($id: ID!) {
                    resource(id: $id) {
                        id
                        name
                        records {
                            id
                            data
                        }
                    }
                }`,
        variables: {
          id: question.resource,
        },
      };
      xhr.responseType = 'json';
      xhr.open('POST', url);
      const token = localStorage.getItem('msal.idtoken');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = () => {
        const serverRes = xhr.response.data.resource.records;
        const res = [];
        for (const item of serverRes) {
          res.push({ value: item.id, text: item.data[question.displayField] });
        }
        // question.choices = res;
        question.contentQuestion.choices = res;
        question.survey.render();
      };
      xhr.send(JSON.stringify(query));
    },
    onAfterRender(question, el): void {
      if (question.canAddNew && question.addTemplate) {
        document.addEventListener('saveResourceFromEmbed', (e: CustomEvent) => {
          const detail = e.detail;
          if (detail.template === question.addTemplate) {
            const url = API_GRAPHQL;
            const xhr = new XMLHttpRequest();
            const query = {
              query: `query GetResourceById($id: ID!) {
                                resource(id: $id) {
                                    id
                                    name
                                    records {
                                        id
                                        data
                                    }
                                }
                            }`,
              variables: {
                id: question.resource,
              },
            };
            xhr.responseType = 'json';
            xhr.open('POST', url);
            const token = localStorage.getItem('msal.idtoken');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
              const serverRes = xhr.response.data.resource.records;
              const res = [];
              for (const item of serverRes) {
                res.push({
                  value: item.id,
                  text: item.data[question.displayField],
                });
              }
              question.contentQuestion.choices = res;
              question.survey.render();
            };
            xhr.send(JSON.stringify(query));
          }
        });
      }
    },
  };
  Survey.ComponentCollection.Instance.add(component);

  const widget = {
    name: 'addResource',
    isFit: (question) => {
      if (question.getType() === 'resource') {
        return question.canAddNew && question.addTemplate;
      } else {
        return false;
      }
    },
    isDefaultRender: true,
    afterRender: (question, el) => {
      const mainDiv = document.createElement('div');
      const btnEl = document.createElement('button');
      btnEl.innerText = 'Add';
      btnEl.style.width = '120px';
      btnEl.onclick = () => {
        const event = new CustomEvent('openForm', {
          detail: { template: question.addTemplate },
        });
        document.dispatchEvent(event);
      };
      mainDiv.appendChild(btnEl);
      el.parentElement.insertBefore(mainDiv, el);
    },
  };
  Survey.CustomWidgetCollection.Instance.add(widget);
}