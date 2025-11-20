import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { CheckIn } from '../types';

interface Props {
  checkIn: CheckIn;
}

const CheckInCard: React.FC<Props> = ({ checkIn }) => (
  <Card style={styles.card}>
    {checkIn.photoUri && <Image source={{ uri: checkIn.photoUri }} style={styles.image} />}
    <Card.Content>
      <Text variant="bodyMedium">{new Date(checkIn.date).toDateString()}</Text>
      <Text variant="bodySmall">Notes: {checkIn.notes || 'No notes'}</Text>
      <Text variant="bodySmall">Verified: {checkIn.verifiedByPartner ? 'Yes' : 'Pending'}</Text>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12
  },
  image: {
    width: '100%',
    height: 160
  }
});

export default CheckInCard;
