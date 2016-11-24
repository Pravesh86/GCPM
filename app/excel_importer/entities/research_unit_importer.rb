class ResearchUnitImporter
  def initialize(data, is_project_lead)
    @data = data
    @errors = []
    @is_project_lead = is_project_lead
    @research_unit_id
  end

  attr_reader :errors, :data, :is_project_lead, :research_unit_id

  def import!
    return if data.map{|k,v| v }.compact.blank?

    entity_name = is_project_lead ? "investigator" : "collaborator"

    investigator = Investigator.find_or_initialize_by(name: data["#{entity_name}_name"].strip)
    investigator.email = data["#{entity_name}_email_address"].strip
    investigator.website = data["#{entity_name}_website"].strip

    organization = Organization.find_or_initialize_by(name: data["#{entity_name}_organization_name"].strip)
    organization_type = self.validate_organization_type(data["#{entity_name}_organization_type"].strip)

    address = Address.new
    address.city = data["#{entity_name}_organization_city"].strip
    address.country_name = data["#{entity_name}_organization_country"].strip
    address.country_code = data["#{entity_name}_organization_country_iso_code"].strip
    address.latitude = data["#{entity_name}_organization_latitude"].strip
    address.longitude = data["#{entity_name}_organization_longitude"].strip
    address.line_1 = data["#{entity_name}_organization_address"].strip
    address.line_2 = data["#{entity_name}_organization_address_ine_2"].strip              if data["#{entity_name}_organization_address_line_2"]
    address.line_3 = data["#{entity_name}_organization_address_line_3"].strip             if data["#{entity_name}_organization_address_line_3"]
    address.postcode = data["#{entity_name}_organization_postcode"].strip                 if data["#{entity_name}_organization_postcode"]
    address.primary = data["#{entity_name}_organization_primary"].strip                  if data["#{entity_name}_organization_primary"]
    address.state = data["#{entity_name}_organization_state"].strip                       if data["#{entity_name}_organization_state"]
    address.state_code = data["#{entity_name}_organization_state_code"].strip             if data["#{entity_name}_organization_state_code"]
    address.geonames_city_id = data["#{entity_name}_organization_geonames_city_id"].strip if data["#{entity_name}_organization_geonames_city_id"]

    unless organization.valid?
      @errors << { organization: organization.errors.full_messages }
    end

    unless investigator.valid?
      @errors << { investigator: investigator.errors.full_messages }
    end

    unless address.valid?
      @errors << { address: address.errors.full_messages }
    end

    if @errors.compact.flatten.blank?
      organization.organization_type = organization_type
      organization.save!
      investigator.save!
      def_address = Address.find_or_initialize_by(organization_id: organization.id, latitude: address.latitude, longitude: address.longitude, country_name: address.country_name, country_code: address.country_code, city: address.city, line_1: address.line_1)
      def_address.save!
      research_unit = ResearchUnit.find_or_initialize_by(address_id: def_address.id, investigator_id: investigator.id)
      research_unit.save!
      @research_unit_id = research_unit.id
      return true
    else
      Rails.logger.info @errors
      return false
    end
  end

  def validate_organization_type(organization_type)
    return if organization_type.blank?
    ot = organization_type.split('|').map{|e| e.strip.downcase}
    master_ot = OrganizationType.all.pluck(:name).map{|e| e.downcase}
    wrong_types = ot - master_ot
    if wrong_types != []
      @errors << "Unknow organization type(s) #{wrong_types}"
      return
    else
      organization_type = OrganizationType.where('lower(name) in (?)', ot).first
      organization_type
    end
  end


end
