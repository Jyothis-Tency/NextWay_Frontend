import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureRegistry } from "@/enums/features";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isBlocked: boolean;
  createdAt: string;
}

export const SubscriptionCard: React.FC<{
  plan: SubscriptionPlan;
  onEdit: () => void;
  onToggleBlock: () => void;
}> = ({ plan, onEdit}) => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{plan.name}</span>
          <span className="text-xl font-bold">₹{plan.price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Period: {plan.period}</p>
        <p className="mb-2">
          Created: {new Date(plan.createdAt).toLocaleDateString()}
        </p>
        <h4 className="font-semibold mb-2">Features:</h4>
        <ul className="list-disc pl-5 mb-4">
          {plan.features.map((feature) => (
            <li key={feature}>
              {FeatureRegistry[feature as keyof typeof FeatureRegistry]}
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            Edit
          </Button>
          {/* <Button
            onClick={onToggleBlock}
            className={`${
              plan.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {plan.isBlocked ? "Unblock" : "Block"}
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};
