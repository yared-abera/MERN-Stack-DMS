import MaintenanceIssueSubmit from "@/components/common/maintenanceIsseSubmit";


export default function ReportMaintenace() {
  const [IssueTrigered, setIssueTriggered] = useState(true);
  const [formData, setFormData] = useState({
    userInfo: Object.fromEntries(
      Maintainance_Issue.map((item) => [item.name, ""])
    ),
    issueTypes: Object.fromEntries(
      typeOfIssue.map((item) => [item.name, false])
    ),
    description: "",
    otherIssue: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (

    <MaintenanceIssueSubmit />

  )
}