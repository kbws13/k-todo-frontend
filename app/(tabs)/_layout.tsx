import {Tabs} from 'expo-router';
import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {

  return (
      <Tabs>
          <Tabs.Screen name="index" options={{
              title: "Todo Lists", tabBarIcon: ({ color, focused }) => (
                <FontAwesome6 name="list-check" size={24} color={focused ? '#black' : 'black'} />
              ),
          }} />
      </Tabs>
  );
}
