// src/screens/user/EnhancedPDFViewerScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Share
} from 'react-native';
import Pdf from 'react-native-pdf';
import {
  ChevronLeftIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon
} from 'react-native-heroicons/outline';
import { useProgress } from '../../context/ProgressContext';

const { width, height } = Dimensions.get('window');

export default function EnhancedPDFViewerScreen({ route, navigation }) {
  const { pdfUrl, title, courseId, materialId } = route.params;
  const { markMaterialComplete, updateTimeSpent } = useProgress();
  const pdfRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);

  // Track time spent on PDF
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      updateTimeSpent(courseId, 1); // 1 minute per interval
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
      // Mark as completed if user spent reasonable time on PDF
      const timeSpent = (Date.now() - startTime) / 1000 / 60; // minutes
      if (timeSpent > 2) { // If spent more than 2 minutes
        markMaterialComplete(courseId, materialId);
      }
    };
  }, [courseId, materialId]);

  const onLoadComplete = (numberOfPages, filePath) => {
    setTotalPages(numberOfPages);
    setLoading(false);
    setError(null);
  };

  const onPageChanged = (page, numberOfPages) => {
    setCurrentPage(page);
  };

  const onError = (error) => {
    console.error('PDF error:', error);
    setError('Failed to load PDF document');
    setLoading(false);
    Alert.alert('Error', 'Failed to load PDF. Please check your connection.');
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const sharePDF = async () => {
    try {
      await Share.share({
        title: title,
        message: `Check out this PDF: ${title}`,
        url: pdfUrl
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share PDF');
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      pdfRef.current?.setPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      pdfRef.current?.setPage(currentPage - 1);
    }
  };

  const ControlButton = ({ icon: Icon, onPress, disabled = false }) => (
    <TouchableOpacity
      className={`p-3 rounded-lg ${disabled ? 'bg-gray-400' : 'bg-gray-700'}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon size={20} color="white" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ChevronLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </Text>
          </View>
        </View>
      </View>

      {/* PDF Container */}
      <View className="flex-1 bg-gray-800">
        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-4">Loading PDF...</Text>
          </View>
        )}

        {error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg text-center">
              Failed to load PDF document
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Please check your internet connection and try again.
            </Text>
          </View>
        ) : (
          <Pdf
            ref={pdfRef}
            source={{ uri: pdfUrl, cache: true }}
            style={{
              flex: 1,
              width: width,
              height: height - 200,
            }}
            scale={scale}
            onLoadComplete={onLoadComplete}
            onPageChanged={onPageChanged}
            onError={onError}
            enablePaging={true}
            fitPolicy={0}
            spacing={10}
          />
        )}
      </View>

      {/* Controls Footer */}
      <View className="bg-gray-800 p-4 border-t border-gray-700">
        {/* Page Navigation */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center space-x-2">
            <ControlButton 
              icon={ChevronLeftIcon} 
              onPress={goToPrevPage}
              disabled={currentPage <= 1}
            />
            
            <Text className="text-white font-medium">
              {currentPage} / {totalPages}
            </Text>
            
            <ControlButton 
              icon={ChevronLeftIcon} 
              onPress={goToNextPage}
              disabled={currentPage >= totalPages}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </View>

          {/* Zoom Controls */}
          <View className="flex-row items-center space-x-2">
            <ControlButton 
              icon={MagnifyingGlassMinusIcon} 
              onPress={zoomOut}
              disabled={scale <= 0.5}
            />
            
            <Text className="text-white text-sm bg-gray-700 px-3 py-1 rounded">
              {Math.round(scale * 100)}%
            </Text>
            
            <ControlButton 
              icon={MagnifyingGlassPlusIcon} 
              onPress={zoomIn}
              disabled={scale >= 3.0}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center space-x-4">
          <TouchableOpacity 
            className="flex-row items-center bg-blue-600 px-4 py-2 rounded-lg"
            onPress={sharePDF}
          >
            <ShareIcon size={18} color="white" />
            <Text className="text-white font-medium ml-2">Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-green-600 px-4 py-2 rounded-lg"
            onPress={() => Alert.alert('Info', 'Download feature would be implemented here')}
          >
            <DocumentArrowDownIcon size={18} color="white" />
            <Text className="text-white font-medium ml-2">Download</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Help */}
      <View className="bg-gray-700 p-3">
        <Text className="text-gray-400 text-xs text-center">
          💡 Pinch to zoom • Swipe to navigate pages
        </Text>
      </View>
    </View>
  );
}