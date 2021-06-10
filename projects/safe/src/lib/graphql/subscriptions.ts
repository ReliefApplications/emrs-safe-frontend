import {gql} from 'apollo-angular';

import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';
import { Form } from '../models/form.model';

export const NOTIFICATION_SUBSCRIPTION = gql`
subscription NotificationSubscription {
    notification {
        id
        action
        content
        createdAt
        channel {
            id
            title
            application {
                id
            }
        }
        seenBy {
            id
            name
        }
    }
}`;

export interface NotificationSubscriptionResponse {
    notification: Notification;
}

export const RECORD_ADDED_SUBSCRIPTION = gql`
subscription RecordAddedSubscription($resource: ID, $form: ID) {
    recordAdded(resource: $resource, form: $form) {
        id
        data(display: true)
    }
}`;

export interface RecordAddedSubscriptionResponse {
    recordAdded: Record;
}

export const FORM_UNLOCKED_SUBSCRIPTION = gql`
  subscription formUnlocked($form: ID!, $lockedByID: ID!){
    formUnlocked(form: $form, lockedByID: $lockedByID){
      id
      name
      isLocked
      isLockedBy {
        id
        name
      }
    }
  }
`;

export interface FormUnlockedSubscriptionResponse {
    formUnlocked: Form;
}