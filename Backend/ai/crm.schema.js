import {z} from "zod"

const CRMSchema = z.object({
            created_at : z.string().describe("Lead creation date"),
            name : z.string().describe("Lead name"),
            email : z.string().email().describe("Lead email"),
            country_code : z.string().describe("Lead country code"),
            mobile_without_country_code : z.string().describe("Lead mobile number without country code"),
            company : z.string().describe("Lead company name"),
            city : z.string().describe("Lead city"),
            state : z.string().describe("Lead state"),
            country : z.string().describe("Lead country"),
            lead_owner : z.string().describe("Lead owner"),
            crm_status : z.enum(["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE"]).describe("Only use one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE"),
            crm_note : z.string().describe("Use crm_note for: Remarks, Follow-up notes, Additional comments, Extra phone numbers, Extra email addresses, Any useful information that doesn't fit another field "),
            data_source : z.enum(["leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots"]).describe("Only use one of the allowed values. Leave empty if unknown."),
            possession_time : z.string().describe("Property possession time "),
            description : z.string().describe("Additional description"),
});
const responseSchema = z.object({
    extractedRecords : z.array(CRMSchema),
    skippedRecords : z.array(CRMSchema.extend({
        reason : z.string().describe("Reason for skipping the record")
    }))
})


export default responseSchema