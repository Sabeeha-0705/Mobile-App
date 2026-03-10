import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { chatbotAPI } from '../../services/api.jsx';

const CodePracticeScreen = () => {

  const { theme } = useTheme();

  const [code, setCode] = useState(`// Write your code here

function hello() {
  console.log("Hello World!");
}

hello();
`);

  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {

    try {

      setLoading(true);
      setOutput("Running code...");

      const res = await chatbotAPI.codeHelp({
        code: code,
        language: "javascript"
      });

      if (res.data.output) {
        setOutput(res.data.output);
      } else {
        setOutput("Code executed.");
      }

    } catch (error) {

      setOutput("Execution error");

    } finally {

      setLoading(false);

    }

  };

  const handleClear = () => {

    setCode('');
    setOutput('');

  };

  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={styles.toolbar}>

        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: theme.primary }]}
          onPress={handleRun}
        >

          <Ionicons name="play" size={18} color="#fff" />
          <Text style={styles.toolButtonText}>Run Code</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: theme.surface }]}
          onPress={handleClear}
        >

          <Ionicons name="trash" size={18} color={theme.text} />
          <Text style={[styles.toolButtonText, { color: theme.text }]}>
            Clear
          </Text>

        </TouchableOpacity>

      </View>

      <ScrollView style={styles.content}>

        <View style={styles.section}>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Code Editor
          </Text>

          <TextInput
            style={[
              styles.codeInput,
              { backgroundColor: theme.card, color: theme.text }
            ]}
            value={code}
            onChangeText={setCode}
            multiline
            placeholder="Write your code here..."
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />

        </View>

        <View style={styles.section}>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Output
          </Text>

          <View
            style={[
              styles.outputBox,
              { backgroundColor: theme.card }
            ]}
          >

            {loading ? (

              <ActivityIndicator size="small" color={theme.primary} />

            ) : (

              <Text
                style={[
                  styles.outputText,
                  {
                    color:
                      output.startsWith("Error")
                        ? theme.error
                        : theme.text
                  }
                ]}
              >
                {output || "Run your code to see output here..."}
              </Text>

            )}

          </View>

        </View>

      </ScrollView>

    </View>

  );

};

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  toolbar: {
    flexDirection: 'row',
    padding: 15,
    gap: 10
  },

  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6
  },

  toolButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },

  content: {
    flex: 1,
    padding: 15
  },

  section: {
    marginBottom: 20
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },

  codeInput: {
    padding: 15,
    borderRadius: 10,
    fontSize: 14,
    minHeight: 220,
    textAlignVertical: 'top',
    fontFamily: 'monospace'
  },

  outputBox: {
    padding: 15,
    borderRadius: 10,
    minHeight: 100
  },

  outputText: {
    fontSize: 14,
    fontFamily: 'monospace'
  }

});

export default CodePracticeScreen;