import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface SurveyInfo {
    id: string,
    title: string
}

export interface SurveyQuestion {
    questionId: string,
    text: string,
}

export interface Survey {
    surveyId: string,
    title: string,
    description: string,
    questions: SurveyQuestion[]
}

export async function getSurvey(name: string): Promise<{ code: AJAXErrors, survey?: Survey }> {
    const response = await ajax.get("csat/" + name);

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    return { code: AJAXErrors.NoError, survey: await response.result.json() };
}

export async function sendSurvey(surveyId, answers): Promise<AJAXErrors> {
    const response = await ajax.post("csat", {
        surveyId,
        answers
    });

    if (response.error || !response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function getStats(surveyId: string): Promise<{ code: AJAXErrors, data?: any }> {
    const response = await ajax.get("stat/" + surveyId);

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    return { code: AJAXErrors.NoError, data: await response.result.json() };
}

export async function getAllSurveys(): Promise<{ code: AJAXErrors, surveys?: SurveyInfo[] }> {
    const response = await ajax.get("survey");

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    return { code: AJAXErrors.NoError, surveys: rawData.surveys };
}