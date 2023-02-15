/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  AsyncStorage,
  Alert,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {theme} from './color';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@toDos';
const App = () => {
  const [working, setWorking] = useState(true);
  const [writeText, setWriteText] = useState<string>('');
  const [Todo, setTodo] = useState<any>({});
  let inputRef = useRef();

  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };
  const onChangeText = (payload: string) => {
    setWriteText(payload);
  };

  const saveToDos = async (toSave: any) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    loadToDos();
  };
  const loadToDos = async () => {
    const Todos = await AsyncStorage.getItem(STORAGE_KEY);
    setTodo(JSON.parse(Todos || '{}'));
  };

  const deleteTodo = (key: string) => {
    Alert.alert('Delete To Do', 'Are you sure?', [
      {
        text: 'Cancle',
      },
      {
        text: 'Ok',
        style: 'destructive',
        onPress: () => {
          const newTodo = {...Todo};
          delete newTodo[key];
          saveToDos(newTodo);
        },
      },
    ]);
    return;
  };

  const addTodo = () => {
    if (writeText === '') {
      return;
    }
    const newTodo = Object.assign({}, Todo, {
      [Date.now()]: {writeText, working},
    });
    saveToDos(newTodo);
    setWriteText('');
    inputRef?.current?.focus();
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{...styles.btnText, color: working ? 'white' : theme.grey}}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{...styles.btnText, color: !working ? 'white' : theme.grey}}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={working ? 'Add a To do ' : 'where do you want to go?'}
          onSubmitEditing={addTodo}
          blurOnSubmit={false}
          returnKeyType="done"
          value={writeText}
          ref={(input: any) => {
            inputRef = input;
          }}
        />
      </View>
      <ScrollView>
        {Object.keys(Todo).map((key, index) =>
          Todo[key].working === working ? (
            <View style={styles.todo} key={index}>
              <Text style={styles.todoText}>{Todo[key].writeText}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Text style={styles.clear}>❌</Text>
              </TouchableOpacity>
            </View>
          ) : null,
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clear: {
    color: 'white',
  },
  todoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
