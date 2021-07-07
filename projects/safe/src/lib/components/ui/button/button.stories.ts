import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ButtonType, SafeButtonComponent } from './safe-button.component';
import { SafeButtonModule } from './safe-button.module';
import { action } from '@storybook/addon-actions';

export default {
  component: SafeButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeButtonModule
      ],
      providers: []
    })
  ],
  excludeStories: /.*Data$/,
  title: 'SAFE/Button'
} as Meta;

const Template: Story<SafeButtonComponent> = args => ({
  props: {
    ...args
  }
});

export const Default = Template.bind({});
Default.args = {
  buttonType: ButtonType.BASIC,
  text: 'Basic button',
  color: 'primary'
};

export const Raised = Template.bind({});
Raised.args = {
  buttonType: ButtonType.RAISED,
  text: 'Raised button',
  color: 'primary'
};

export const Stroked = Template.bind({});
Stroked.args = {
  buttonType: ButtonType.STROKED,
  text: 'Stroked button',
  color: 'primary'
};

export const Flat = Template.bind({});
Flat.args = {
  buttonType: ButtonType.STROKED,
  text: 'Flat button',
  color: 'primary'
};

export const Icon = Template.bind({});
Icon.args = {
  buttonType: ButtonType.ICON,
  icon: 'more_vert',
  color: 'primary'
};

export const Fab = Template.bind({});
Fab.args = {
  buttonType: ButtonType.FAB,
  icon: 'more_vert',
  color: 'primary'
};

export const MiniFab = Template.bind({});
MiniFab.args = {
  buttonType: ButtonType.MINI_FAB,
  icon: 'more_vert',
  color: 'primary'
};
