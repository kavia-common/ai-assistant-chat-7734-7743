#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-assistant-chat-7734-7743/ai_qna_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

