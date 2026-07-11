import generateResponse from "../ai/gemini.service.js"
import responseSchema from "../ai/crm.schema.js"


const processBatches = async (batches) => {
    const finalResult = {
        extractedRecords: [],
        skippedRecords: [],
    };

    for (const batch of batches) {
        const response = await generateResponse(batch, responseSchema);

        finalResult.extractedRecords.push(...response.extractedRecords);
        finalResult.skippedRecords.push(...response.skippedRecords);
    }

    return {
        extractedRecords: finalResult.extractedRecords,
        skippedRecords: finalResult.skippedRecords,
        totalExtracted: finalResult.extractedRecords.length,
        totalSkipped: finalResult.skippedRecords.length,
    };
};

export default processBatches;