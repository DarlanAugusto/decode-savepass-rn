import React, { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Card, CardProps } from '../../components/Card';
import { HeaderHome } from '../../components/HeaderHome';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from './styles';
import { Button } from '../../components/Button';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export function Home() {
  const [data, setData] = useState<CardProps[]>([]);

  const {getItem, setItem, removeItem} = useAsyncStorage("@savepass:passwords");

  const handleFetchData = async () => {
    try {
      const response = await getItem();
      const data = response ? JSON.parse(response) : [];
      
      setData(data);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Não foi possível carregar os itens."
      })
      
    }
    
  }

  const handleRemove = async (id: string) => {
    try {
      const response = await getItem();
      const data = response ? JSON.parse(response) : [];
      const newData = data.filter((item: CardProps) => item.id !== id);

      await setItem(JSON.stringify(newData));
      setData(newData);

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Item removido."
      });

    } catch (error) {
      console.log(error);
      
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Não foi possível remover o item."
      });
      
    }
  }

  const handleClearAll = async () => {
    try {
      await removeItem();

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Todos os itens foram removidos."
      })
    } catch (error) {
      console.log(error);

      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: "Não foi possível remover os itens."
      })
      
    }
  }

  useFocusEffect(useCallback(() => {
    handleFetchData();
  }, []));

  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>
          Suas senhas
        </Text>

        <Text style={styles.listCount}>
          {`${data.length} ao total`}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          <Card
            data={item}
            onPress={() => handleRemove(item.id)}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          title="Limpar lista"
          onPress={() => handleClearAll()}
        />
      </View>
    </View>
  );
}