import React, { JSX } from 'react'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { TodoCategory } from '../../types';

const TodoIconComponents: Record<TodoCategory, JSX.Element> = {
    会社: <WorkHistoryIcon fontSize='small'/>,
    プライベート: <ImportContactsIcon fontSize='small'/>,
    勉強: <EmojiPeopleIcon fontSize='small'/>,
}

export default TodoIconComponents