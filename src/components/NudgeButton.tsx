import React from 'react';
import { Button } from 'react-native-paper';

interface Props {
  onSend: () => void;
  label?: string;
}

const NudgeButton: React.FC<Props> = ({ onSend, label = 'Send nudge' }) => (
  <Button mode="outlined" onPress={onSend} icon="bell-ring-outline">
    {label}
  </Button>
);

export default NudgeButton;
