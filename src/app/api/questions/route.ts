import { strict_output } from '@/lib/gpt';
import { getAuthSession } from '@/lib/nextauth';
import { getQuestionsSchema } from '@/schemas/questions';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 5000;

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);

    let questions: any;

    // Function to check if the option matches the answer
    const checkAndReplaceAnswer = (
      options: string[],
      answer: string
    ): string[] => {
      return options.map((option) => {
        // If the option exactly matches the answer, replace it with "None of these"
        if (option.toLowerCase() === answer.toLowerCase()) {
          return 'None of these';
        }
        return option;
      });
    };

    if (type === 'open_ended') {
      questions = await strict_output(
        'You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array',
        new Array(amount).fill(
          `You are to generate a random hard maq question about ${topic} and it has more than 4 options and in those four options more than one is correct`
        ),
        {
          question: 'question',
          options: ['option1', 'option2', 'option3', 'option4'],
          answers: ['2', '3'],
        }
      );
    } else if (type === 'mcq') {
      questions = await strict_output(
        'You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array',
        new Array(amount).fill(
          `You are to generate a random hard mcq question about ${topic}`
        ),
        {
          question:
            'question don"t ask any program code don"t use Invalid JSON Format no special char any ,} not allowed',
          answer: 'answer one word',
          option1:
            'option1 one word answer and option must not be same as answer otherwise my code will not work',
          option2:
            'option2 one word answer and option must not be same as answer otherwise my code will not work',
          option3:
            'option3 one word answer and option must not be same as answer otherwise my code will not work',
        }
      );

      // Loop through each question and check if any option matches the answer
      questions = questions.map((question: any) => {
        const { answer, options } = question;

        // Ensure the options are an array
        const optionsArray = [
          question.option1,
          question.option2,
          question.option3,
        ];

        // Replace matching options with "None of these"
        const updatedOptions = checkAndReplaceAnswer(optionsArray, answer);

        // Update the question object with the modified options
        question.options = updatedOptions;

        return question;
      });
    }

    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error('elle gpt error', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred.' },
        {
          status: 500,
        }
      );
    }
  }
}
