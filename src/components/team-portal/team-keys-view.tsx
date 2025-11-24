'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Key } from 'lucide-react';

interface TeamAccessCode {
  id: number;
  operation: string;
  sequenceOrder: number;
  isActive: boolean;
  createdAt: string;
}

export const TeamKeysView = () => {
  const [accessCodes, setAccessCodes] = useState<TeamAccessCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<TeamAccessCode | null>(null);
  
  const [formData, setFormData] = useState({
    operation: '',
    sequenceOrder: '',
  });

  useEffect(() => {
    fetchAccessCodes();
  }, []);

  const fetchAccessCodes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/team-access/codes');
      const data = await response.json();
      setAccessCodes(data);
    } catch (error) {
      console.error('Failed to fetch access codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCode(null);
    setFormData({
      operation: '',
      sequenceOrder: (accessCodes.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (code: TeamAccessCode) => {
    setEditingCode(code);
    setFormData({
      operation: code.operation,
      sequenceOrder: code.sequenceOrder.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const codeData = {
        operation: formData.operation,
        sequenceOrder: parseInt(formData.sequenceOrder),
        isActive: true,
      };

      if (editingCode) {
        // Update
        await fetch(`/api/team-access/codes?id=${editingCode.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(codeData),
        });
      } else {
        // Create
        await fetch('/api/team-access/codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(codeData),
        });
      }

      setIsModalOpen(false);
      fetchAccessCodes();
    } catch (error) {
      console.error('Failed to save access code:', error);
    }
  };

  const deleteAccessCode = async (codeId: number) => {
    if (!confirm('Are you sure you want to delete this access code?')) return;
    
    try {
      await fetch(`/api/team-access/codes?id=${codeId}`, {
        method: 'DELETE',
      });
      fetchAccessCodes();
    } catch (error) {
      console.error('Failed to delete access code:', error);
    }
  };

  const evaluateOperation = (operation: string): string => {
    try {
      const cleanOperation = operation.trim().replace(/=$/, '');
      const match = cleanOperation.match(/^(\d+)\s*([+\-×÷])\s*(\d+)$/);
      
      if (!match) return '?';
      
      const num1 = parseInt(match[1], 10);
      const operator = match[2];
      const num2 = parseInt(match[3], 10);
      
      let result: number;
      switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '×': result = num1 * num2; break;
        case '÷': result = num1 / num2; break;
        default: return '?';
      }
      
      return result.toString();
    } catch {
      return '?';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-[32px]">
        <h1 className="text-[28px] md:text-[32px] font-bold text-foreground uppercase mb-[16px]">Team Keys Management</h1>
        <p className="text-[14px] text-grey-40 mb-[24px]">
          Manage calculator operations that grant access to the team portal. The operation <strong>9426+777=</strong> is required for access.
        </p>
        
        <button
          onClick={openCreateModal}
          className="h-[44px] px-[24px] flex items-center gap-[8px] bg-primary text-primary-foreground rounded-lg font-bold text-[12px] uppercase hover:opacity-90 transition-opacity shadow-md"
        >
          <Plus className="w-[16px] h-[16px]" />
          Add Access Code
        </button>
      </div>

      {/* Access Codes List */}
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-[80px]">
            <div className="inline-block w-[40px] h-[40px] border-4 border-grey-20 border-t-primary rounded-full animate-spin mb-[16px]"></div>
            <div className="text-[14px] text-grey-40 uppercase font-medium">Loading Access Codes...</div>
          </div>
        ) : accessCodes.length === 0 ? (
          <div className="text-center py-[80px] text-grey-40 text-[14px]">
            No access codes configured. Create your first access code!
          </div>
        ) : (
          <div className="p-[20px] space-y-[16px]">
            {accessCodes.map((code) => (
              <div
                key={code.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-[16px] sm:gap-[20px] p-[24px] bg-grey-10 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-[48px] h-[48px] bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-[18px] shrink-0">
                  {code.sequenceOrder}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-[12px] mb-[8px]">
                    <Key className="w-[16px] h-[16px] text-grey-40 shrink-0" />
                    <span className="text-[18px] md:text-[20px] font-bold text-foreground font-mono break-all">{code.operation}</span>
                    <span className="text-[16px] text-grey-40 shrink-0">→</span>
                    <span className="text-[18px] md:text-[20px] font-bold text-primary font-mono">{evaluateOperation(code.operation)}</span>
                  </div>
                  <div className="text-[12px] text-grey-40">
                    Sequence Order: {code.sequenceOrder} • Created: {new Date(code.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-[8px] w-full sm:w-auto">
                  <button
                    onClick={() => openEditModal(code)}
                    className="flex-1 sm:flex-initial h-[40px] px-[16px] flex items-center justify-center gap-[8px] bg-white border border-border text-foreground rounded font-bold text-[12px] uppercase hover:bg-grey-20 transition-colors"
                  >
                    <Edit className="w-[14px] h-[14px]" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => deleteAccessCode(code.id)}
                    className="flex-1 sm:flex-initial h-[40px] px-[16px] flex items-center justify-center gap-[8px] bg-red-600 text-white rounded font-bold text-[12px] uppercase hover:opacity-90 transition-opacity"
                  >
                    <Trash2 className="w-[14px] h-[14px]" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-[32px] bg-blue-50 border border-blue-200 rounded-lg p-[24px]">
        <h3 className="text-[16px] font-bold text-blue-900 uppercase mb-[12px]">How It Works</h3>
        <ul className="space-y-[8px] text-[14px] text-blue-800">
          <li>• Team members navigate to the Calculator page</li>
          <li>• They perform the mathematical operation: <strong>9426+777=</strong></li>
          <li>• When they complete this operation correctly, they are automatically redirected to the Team Portal</li>
          <li>• Example: Type <strong>9426</strong>, press <strong>+</strong>, type <strong>777</strong>, then press <strong>=</strong></li>
        </ul>
      </div>

      {/* Access Code Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-[20px] bg-black/50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-[500px] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border p-[24px] flex items-center justify-between">
              <h2 className="text-[20px] font-bold uppercase">{editingCode ? 'Edit Access Code' : 'Add Access Code'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-[8px] hover:bg-grey-10 rounded transition-colors">
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-[24px] space-y-[20px]">
              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">
                  Mathematical Operation
                </label>
                <input
                  type="text"
                  required
                  value={formData.operation}
                  onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
                  placeholder="e.g., 9426+777="
                  className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-[8px] text-[12px] text-grey-40">
                  Format: number + operator + number + = (e.g., 9426+777=)
                </p>
                {formData.operation && (
                  <div className="mt-[8px] p-[12px] bg-grey-10 rounded">
                    <span className="text-[12px] text-grey-40">Result: </span>
                    <span className="text-[16px] font-bold text-primary font-mono">{evaluateOperation(formData.operation)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">
                  Sequence Order
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.sequenceOrder}
                  onChange={(e) => setFormData({ ...formData, sequenceOrder: e.target.value })}
                  className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-[8px] text-[12px] text-grey-40">
                  The order in which this operation must be performed (1 = first, 2 = second, etc.)
                </p>
              </div>

              <div className="flex gap-[12px] pt-[20px] border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-[48px] bg-grey-20 text-foreground rounded-lg font-bold text-[14px] uppercase hover:bg-grey-40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[48px] bg-primary text-primary-foreground rounded-lg font-bold text-[14px] uppercase hover:opacity-90 transition-opacity"
                >
                  {editingCode ? 'Update Code' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};