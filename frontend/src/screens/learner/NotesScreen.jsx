import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { noteAPI } from '../../services/api.jsx';

const NotesScreen = () => {

  const { theme } = useTheme();

  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {

    try {

      const response = await noteAPI.getAllNotes();
      setNotes(response.data.notes || []);

    } catch (error) {

      console.log(error);

    }

  };

  const handleSave = async () => {

    if (!title || !content) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {

      if (editingNote) {

        await noteAPI.updateNote(editingNote._id, {
          title,
          content
        });

      } else {

        await noteAPI.createNote({
          title,
          content
        });

      }

      setModalVisible(false);
      setTitle('');
      setContent('');
      setEditingNote(null);

      fetchNotes();

    } catch (error) {

      Alert.alert("Error", "Failed to save note");

    }

  };

  const handleEdit = (note) => {

    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);

  };

  const handleDelete = (noteId) => {

    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {

            try {

              await noteAPI.deleteNote(noteId);
              fetchNotes();

            } catch (error) {

              Alert.alert("Error", "Delete failed");

            }

          }
        }
      ]
    );

  };

  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <ScrollView style={styles.notesList}>

        {notes.length === 0 && (

          <Text style={{ color: theme.textSecondary, textAlign: "center", marginTop: 40 }}>
            No notes yet
          </Text>

        )}

        {notes.map(note => (

          <View key={note._id} style={[styles.noteCard, { backgroundColor: theme.card }]}>

            <Text style={[styles.noteTitle, { color: theme.text }]}>
              {note.title}
            </Text>

            <Text
              style={[styles.noteContent, { color: theme.textSecondary }]}
              numberOfLines={3}
            >
              {note.content}
            </Text>

            <View style={styles.noteActions}>

              <TouchableOpacity
                onPress={() => handleEdit(note)}
                style={styles.actionButton}
              >
                <Ionicons name="create-outline" size={20} color={theme.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(note._id)}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={20} color={theme.error} />
              </TouchableOpacity>

            </View>

          </View>

        ))}

      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>

        <View style={styles.modalContainer}>

          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>

            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingNote ? "Edit Note" : "New Note"}
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Title"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Content"
              placeholderTextColor={theme.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
            />

            <View style={styles.modalActions}>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.surface }]}
                onPress={() => {

                  setModalVisible(false);
                  setTitle('');
                  setContent('');
                  setEditingNote(null);

                }}
              >
                <Text style={{ color: theme.text }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

    </View>

  );

};

const styles = StyleSheet.create({

  container: { flex: 1 },

  notesList: { flex: 1, padding: 15 },

  noteCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },

  noteContent: {
    fontSize: 14,
    lineHeight: 20
  },

  noteActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 15
  },

  actionButton: {
    padding: 5
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 15
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },

  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16
  },

  textArea: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top'
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },

  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  }

});

export default NotesScreen;