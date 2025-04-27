import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaTrash, FaDatabase } from 'react-icons/fa';
import { MdBackup } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

const BackupManagement = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Axios configuration with credentials
  const axiosConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Fetch backups on component mount
  useEffect(() => {
    fetchBackups();
  }, []);

  // Fetch all backups
  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/api/backup', axiosConfig);
      
      if (response.data.success) {
        setBackups(response.data.data || []);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch backups');
      }
    } catch (err) {
      console.error('Error fetching backups:', err);
      setError(err.response?.data?.message || 'Failed to fetch backups. Check if you have admin access.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new backup
  const createBackup = async () => {
    setActionInProgress(true);
    try {
      const response = await axios.post('http://localhost:9000/api/backup', {}, axiosConfig);
      
      if (response.data.success) {
        setBackups(response.data.backups || []);
        setSuccess('Backup created successfully');
        setTimeout(() => setSuccess(null), 5000);
        // Reload the list to ensure we have the latest data
        fetchBackups();
      } else {
        setError(response.data.message || 'Failed to create backup');
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      setError(err.response?.data?.message || 'Failed to create backup. Check if you have admin access.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Delete a backup
  const deleteBackup = async (filename) => {
    setActionInProgress(true);
    try {
      const response = await axios.delete(`http://localhost:9000/api/backup/${filename}`, axiosConfig);
      
      if (response.data.success) {
        setBackups(response.data.data || []);
        setSuccess('Backup deleted successfully');
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(response.data.message || 'Failed to delete backup');
      }
    } catch (err) {
      console.error('Error deleting backup:', err);
      setError(err.response?.data?.message || 'Failed to delete backup. Check if you have admin access.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Download a backup
  const downloadBackup = (filename) => {
    // Create a full URL with credentials
    const downloadUrl = `http://localhost:9000/api/backup/download/${filename}`;
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Open restore confirmation modal
  const openRestoreModal = (backup) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  // Close restore confirmation modal
  const closeRestoreModal = () => {
    setShowRestoreModal(false);
    setSelectedBackup(null);
  };

  // Restore database from backup
  const restoreBackup = async () => {
    if (!selectedBackup) return;
    
    setActionInProgress(true);
    try {
      const response = await axios.post(
        `http://localhost:9000/api/backup/restore/${selectedBackup.filename}`, 
        {}, 
        axiosConfig
      );
      
      if (response.data.success) {
        setSuccess('Database restored successfully');
        setTimeout(() => setSuccess(null), 5000);
        closeRestoreModal();
      } else {
        setError(response.data.message || 'Failed to restore backup');
      }
    } catch (err) {
      console.error('Error restoring backup:', err);
      setError(err.response?.data?.message || 'Failed to restore backup. Check if you have admin access.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="backup-management container py-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h4 className="flex items-center"><MdBackup className="mr-2" /> Database Backup Management</h4>
          <Button 
            onClick={createBackup} 
            disabled={actionInProgress}
          >
            {actionInProgress ? (
              <>
                <Spinner className="mr-2" />
                Creating Backup...
              </>
            ) : (
              <>
                <FaDatabase className="mr-2" /> Create New Backup
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <Spinner />
              <p className="mt-2">Loading backups...</p>
            </div>
          ) : backups.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.filename}>
                    <TableCell>{backup.filename}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell>{formatFileSize(backup.size)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => openRestoreModal(backup)}
                        disabled={actionInProgress}
                      >
                        Restore
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadBackup(backup.filename)}
                      >
                        <FaDownload />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteBackup(backup.filename)}
                        disabled={actionInProgress}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p>No backups found. Create your first backup.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restore Confirmation Modal */}
      <Dialog open={showRestoreModal} onOpenChange={setShowRestoreModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Database Restore</DialogTitle>
            <DialogDescription>
              <div className="my-4">
                <strong>Warning:</strong> Restoring this backup will replace all current data in the database with the data from this backup file. This action cannot be undone.
              </div>
              {selectedBackup && (
                <p>
                  Are you sure you want to restore from backup: <strong>{selectedBackup.filename}</strong>?
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={closeRestoreModal}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={restoreBackup} 
              disabled={actionInProgress}
            >
              {actionInProgress ? (
                <>
                  <Spinner className="mr-2" />
                  Restoring...
                </>
              ) : (
                "Restore Database"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupManagement; 