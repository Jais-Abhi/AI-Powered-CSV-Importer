import {z} from "zod"

const CRMSchema = z.object({
            created_at : z.string().optional().describe("Lead creation date"),
            name : z.string().optional().describe("Lead name"),
            email : z.string().email().optional().describe("Lead email"),
            country_code : z.string().optional().describe("Lead country code"),
            mobile_without_country_code : z.string().optional().describe("Lead mobile number without country code"),
            company : z.string().optional().describe("Lead company name"),
            city : z.string().optional().describe("Lead city"),
            state : z.string().optional().describe("Lead state"),
            country : z.string().optional().describe("Lead country"),
            lead_owner : z.string().optional().describe("Lead owner"),
            crm_status : z.enum(["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE"]).describe("Only use one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE"),
            crm_note : z.string().optional().describe("Use crm_note for: Remarks, Follow-up notes, Additional comments, Extra phone numbers, Extra email addresses, Any useful information that doesn't fit another field "),
            data_source : z.enum(["leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots"]).optional().describe("Only use one of the allowed values. Leave empty if unknown."),
            possession_time : z.string().optional().describe("Property possession time "),
            description : z.string().optional().describe("Additional description"),
});
const responseSchema = z.object({
    importedRecords : z.array(CRMSchema),
    skippedRecords : z.array(CRMSchema.extend({
        reason : z.string().describe("Reason for skipping the record")
    }))
})


export default responseSchema